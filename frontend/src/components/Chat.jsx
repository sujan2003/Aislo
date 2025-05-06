import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import { auth } from "../firebase-config";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput("");
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/chat" className="logo">Aislo</Link>

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

      <div className="chat-box">
        <p>Grocery Shopping Assistance</p>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Start typing..."
        />
      </div>

      <div className="chat-footer"></div>
    </div>
  );
};

export default Chat;