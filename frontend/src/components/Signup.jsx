import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Combined imports
import "./Style.css";
import "./Chat.css";

const Login = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="chat-container">
      {/* Header */}
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
        <h2>Create New Account</h2>
        <br />
        <h3>Name</h3>
        <input type="text" placeholder="Enter your name" />
        <h3>Email</h3>
        <input type="email" placeholder="Enter your email" />
        <h3>Password</h3>
        <input type="password" placeholder="Enter your password" />
        <button className="signup-btn" onClick={() => navigate("/questions")}>
          Sign Up
        </button>
        <h3>
          Already a user? <Link to="/Login">Click here to login</Link>
        </h3>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
