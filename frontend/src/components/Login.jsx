import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Style.css";
import "./Chat.css";

const Login = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="chat-header">
        <Link to="/chat" className="logo">Aislo</Link>

        {/* Profile Dropdown */}
        <div className="profile-dropdown">
          <span className="material-symbols-outlined" onClick={toggleDropdown}>
            account_circle
          </span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to="/signup" className="dropdown-item">Sign Up</Link>
              <Link to="/login" className="dropdown-item">Log In</Link>
            </div>
          )}
        </div>
      </div>

      {/* Login Form */}
      <div className="login-box">
        <h2>Login to get started!</h2>
        <br />
        <h3>Email</h3>
        <input type="email" placeholder="Enter your email" />
        <h3>Password</h3>
        <input type="password" placeholder="Enter your password" />
        <button className="signup-btn">Login</button>
        <h3>
        <br></br>
          Forgot Password? <br></br>
          <Link to="/ForgotPassword">Click here to reset your password</Link>
        </h3>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
