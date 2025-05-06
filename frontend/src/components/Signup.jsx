import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Style.css";
import Header from "./Header";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!hasNumber || !hasSpecialChar || !isLongEnough) {
      setPasswordMessage("Password must be at least 8 characters long and include a number and a special character.");
    } else {
      setPasswordMessage("");
    }
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password || !dietaryRestrictions) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post("http://localhost:5000/signup", {
        firstName,
        lastName,
        email,
        password,
        dietaryRestrictions,
      });

      setSuccessMessage("Signup successful! Redirecting to login...");
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || "Signup failed. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="chat-container">
      <Header />

      <div className="login-box">
        <h2>Create New Account</h2>
        <br />
        {successMessage && <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}

        <div className="name-container">
          <div className="name-field">
            <h3>First Name</h3>
            <input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="name-field">
            <h3>Last Name</h3>
            <input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <h3>Email</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h3>Password</h3>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        {passwordMessage && <p style={{ color: "red", fontSize: "0.9em" }}>{passwordMessage}</p>}

        <h3>Dietary Restrictions</h3>
        <input
          type="text"
          placeholder="Enter your dietary restrictions"
          value={dietaryRestrictions}
          onChange={(e) => setDietaryRestrictions(e.target.value)}
        />

        <div className="button-container">
          <button className="signup-btn" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>

        <h3>
          Already a user?{" "}
          <button className="navigate-btn" onClick={handleNavigateToLogin}>
            Click here to login
          </button>
        </h3>
      </div>

      <div className="chat-footer"></div>
    </div>
  );
};

export default Signup;
