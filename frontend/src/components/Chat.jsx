import { Link } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const updateInput = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const botMessage = { sender: "bot", text: "Hi!" };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

      {/* Chat Wrapper */}
      <div className="chat-wrapper">
        <div className="chat-box scrollable">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Field */}
        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={updateInput}
            placeholder="Start typing..."
          />
          <button onClick={handleSubmit}>Send</button>
        </div>
      </div>

      {/* Footer */}
      <div className="chat-footer"></div>
    </div>
  );
};

export default Chat;
