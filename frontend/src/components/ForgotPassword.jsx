import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Style.css";
import "./Chat.css";

const Login = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Popup state

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = () => {
    setShowPopup(true); // Show the popup
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <Link to="/chat" className="logo">Aislo</Link>
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

      {/* Form */}
      <div className="login-box">
        <h2>Reset Password</h2>
        <br />
        <h3>Email</h3>
        <input type="email" placeholder="Enter your email" />
        <button className="signup-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>Reset link sent to your email!</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
