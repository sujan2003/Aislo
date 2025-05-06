import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./Style.css";
import "./Chat.css";
import Header from "./Header"; // Import the Header component

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [popupMessage, setPopupMessage] = useState(""); // Message for the popup
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setPopupMessage("A reset link has been sent to your email!");
      setShowPopup(true); // Show the popup
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      setShowPopup(false); // Hide the popup if there's an error
      if (error.code === "auth/user-not-found") {
        setErrorMessage("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Invalid email address. Please try again.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Forgot Password Error:", error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="chat-container">
      <Header/>

      {/* Form */}
      <div className="login-box">
        <h2>Reset Password</h2>
        <br />
        {/* Display error message */}
        {errorMessage && <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>}
        <h3>Email</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="signup-btn" onClick={handleSubmit}>Submit</button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <div className="chat-footer"></div>
    </div>
  );
};

export default ForgotPassword;
