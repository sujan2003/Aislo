import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import "./Login.css"; // Import CSS file
import "./Chat.css"; // Import Chat styles

const Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="login-container">
      {/* Header */}
      <div className="chat-header">
        <div className="logo">Aislo</div>
        <button className="chat-btn" onClick={() => navigate("/chat")}>
          Home
        </button>
      </div>

      {/* Login Form */}
      <div className="login-box">
        <h2>Create New Account</h2>
        <h3>Name</h3>
        <input type="text" placeholder="Enter your name" /> 
        <h3>Email</h3>
        <input type="email" placeholder="Enter your email" /> 
        <h3>Password</h3>
        <input type="password" placeholder="Enter your password" /> 
        <button className="signup-btn">Sign Up</button>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
