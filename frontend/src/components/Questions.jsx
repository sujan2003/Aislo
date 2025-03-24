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
        <h2>Personal Preferences</h2>
        <br></br>
        <h3>Do you have any dietary restrictions?</h3>
        <input type="text" placeholder="e.g., Vegetarian, Gluten-free, None" /> 
        <h3>Do you have any food allergies?</h3>
        <input type="text" placeholder="e.g., Peanuts, Shellfish, Dairy, None" />
        <h3>What is your preferred grocery store?</h3>
        <input type="text" placeholder="e.g., Walmart, Target, Whole Foods" /> 
        <h3>What is your weekly grocery budget range?</h3>
        <input type="text" placeholder="e.g., $50–$75, $100–$150" />
        <button className="signup-btn" onClick={() => navigate("/chat")}>
            Done
        </button>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Login;
