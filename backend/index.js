import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import firebaseAdmin from 'firebase-admin';
import { readFileSync } from 'fs';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit'; // +++ ADDED FOR RATE LIMITING +++

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
let db;

try {
  const serviceAccount = JSON.parse(readFileSync('./config/serviceAccountKey.json', 'utf-8'));

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
  });

  db = firebaseAdmin.firestore();
  db.settings({ ignoreUndefinedProperties: true });

  console.log('Firebase initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000' }));

// +++ RATE LIMITING MIDDLEWARE +++
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many attempts, please try again later.',
});
app.use('/login', limiter); // Apply to login
app.use('/signup', limiter); // Apply to signup

// Helper functions for Firestore
const createUser = async (userData) => {
  await db.collection('users').doc(userData.uid).set(userData);
};

const getUserByUID = async (uid) => {
  const userDoc = await db.collection('users').doc(uid).get();
  return userDoc.exists ? userDoc.data() : null;
};

const updateUser = async (uid, updates) => {
  await db.collection('users').doc(uid).update(updates);
};

// Middleware to Verify Firebase Token
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  console.log('ID Token:', idToken);

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Email Deliverability Check
const validateEmailDeliverability = async (email) => {
  try {
    const response = await axios.get('https://emailvalidation.abstractapi.com/v1/', {
      params: {
        api_key: process.env.ABSTRACT_API_KEY,
        email,
      },
    });
    return response.data.deliverability === 'DELIVERABLE';
  } catch (error) {
    console.error('Error validating email deliverability:', error.response?.data || error.message);
    return false;
  }
};

// Email Sender
const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Password Validator
const validatePassword = (password) => {
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return hasNumber && hasSpecialChar;
};

// Signup Route (No changes)
app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName, dietaryRestrictions } = req.body;

  if (!email || !password || !firstName || !lastName || !dietaryRestrictions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must include a number and a special character.' });
  }

  try {
    const isDeliverable = await validateEmailDeliverability(email);
    if (!isDeliverable) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const userRecord = await firebaseAdmin.auth().createUser({ email, password });
    const newUser = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      dietaryRestrictions,
      verified: false,
      deleted: false,
    };
    await createUser(newUser);

    const emailVerificationLink = await firebaseAdmin.auth().generateEmailVerificationLink(email);
    await sendEmail(email, "Verify Your Email", `<p>Click <a href="${emailVerificationLink}">here</a> to verify.</p>`);

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login Route (No changes)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
    if (!userRecord) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = await getUserByUID(userRecord.uid);
    if (!user || user.deleted) {
      return res.status(404).json({ error: "User not found or deleted." });
    }

    const token = await firebaseAdmin.auth().createCustomToken(userRecord.uid);

    // +++ SESSION MANAGEMENT: Set HTTP-only cookie for the token +++
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === "auth/wrong-password") {
      return res.status(401).json({ error: "Invalid password." });
    } else if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "User not found." });
    } else {
      return res.status(500).json({ error: "An unexpected error occurred. Please try again." });
    }
  }
});

// +++ PASSWORD RESET FIX: Send link via email instead of returning it +++
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const resetLink = await firebaseAdmin.auth().generatePasswordResetLink(email);
    await sendEmail(email, "Password Reset", `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ error: "Error sending password reset email" });
  }
});

// +++ LOGOUT FIX: Revoke Firebase token and clear cookie +++
app.post('/logout', verifyFirebaseToken, async (req, res) => {
  try {
    await firebaseAdmin.auth().revokeRefreshTokens(req.user.uid);
    res.clearCookie('session');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

// Soft Delete, Restore, Protected Routes (No changes)
app.delete('/delete-user', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await getUserByUID(uid);
    if (!user) return res.status(404).json({ error: "User not found" });
    await updateUser(uid, { deleted: true });
    res.status(200).json({ message: "User soft deleted" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting user" });
  }
});

app.post('/restore-user', async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await getUserByUID(uid);
    if (!user || !user.deleted) return res.status(404).json({ error: "User not found or not deleted" });
    await updateUser(uid, { deleted: false });
    res.status(200).json({ message: "User restored", user });
  } catch (error) {
    res.status(400).json({ error: "Error restoring user" });
  }
});

app.get('/protected', verifyFirebaseToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});