import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Style.css";
import "./Chat.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config"; // update path as needed
import Header from "./Header"; 





const Login = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages
  const [loading, setLoading] = useState(false); // State for loading

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter your email and password.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      setSuccessMessage("Login successful!");
      navigate("/chat");
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="chat-container">
     <Header/>
      {/* Login Form */}
      <div className="login-box">
        <h2>Login to get started!</h2>
        <br />
        {/* Display error message */}
        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green", textAlign: "center" }}>{successMessage}</p>}
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
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="signup-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <h3>
          <br />
          Forgot Password? <br />
          <Link to="/ForgotPassword">Click here to reset your password</Link>
        </h3>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;