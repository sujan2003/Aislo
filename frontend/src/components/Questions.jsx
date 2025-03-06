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
        <h2>Personal Preferences</h2>
        <br></br>
        <h3>Question</h3>
        <input type="text" placeholder="Answer" /> 
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
