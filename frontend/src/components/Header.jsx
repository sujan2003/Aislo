import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase-config";
import "./Style.css"; 

const Header = () => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const handleLogout = async () => {
      try {
        await auth.signOut();
        navigate("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };
  
    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };
  
    return (
      <div className="chat-header">
        <span className="logo" onClick={() => navigate("/chat")} style={{ cursor: "pointer" }}>
          Aislo
        </span>
  
        <div className="profile-dropdown">
          <span className="material-symbols-outlined" onClick={toggleDropdown}>
            account_circle
          </span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              {auth.currentUser ? (
                <button onClick={handleLogout} className="dropdown-item">
                  Log Out
                </button>
              ) : (
                <>
                  <Link to="/signup" className="dropdown-item">Sign Up</Link>
                  <Link to="/login" className="dropdown-item">Log In</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default Header;