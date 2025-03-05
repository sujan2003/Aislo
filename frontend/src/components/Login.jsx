import React from "react";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { Link } from "react-router-dom";
import "./Style.css"; // Import CSS file
import "./Chat.css"; // Import Chat styles

const Login = () => {
  const navigate = useNavigate(); // Initialize navigation

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
      <Link to="/chat" className="logo">Aislo</Link> {/* Displaying the chat logo */}
            <Link to="/signup" className="profile-icon">
              <span className="material-symbols-outlined">account_circle</span>
            </Link> {/* Displaying the chat logo */}
      </div>

      {/* Login Form */}
      <div className="login-box">
        <h2>Login to get started!</h2>
        <br></br>
        <h3>Email</h3>
        <input type="email" placeholder="Enter your email" /> 
        <h3>Password</h3>
        <input type="password" placeholder="Enter your password" /> 
        <button className="signup-btn">Login</button>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
