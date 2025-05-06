// Header.jsx - to keep consistency across all components
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase-config";
import "./Style.css"; // Include if header styles are here

const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogoClick = () => {
    if (auth.currentUser) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="chat-header">
      <span className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
        Aislo
      </span>

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
  );
};

export default Header;
