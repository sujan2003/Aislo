import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
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

      {/* Chat Box */}
      <div className="chat-box">
        <p>Grocery Shopping Assistance</p>
      </div>

      {/* Input Field */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing..."
        />
      </div>

      {/* Footer Section */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Chat;
