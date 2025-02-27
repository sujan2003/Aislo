// https://www.dhiwise.com/post/how-to-build-a-real-time-react-chat-application

import {useNavigate} from "react-router-dom"; // Import useNavigate hook
import React, { useState } from "react"; // Import React and useState hook
import "./Chat.css"; // Import CSS file for styling

const Chat = () => {
  // State variables to store messages and input text
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Function to handle sending messages
  const sendMessage = () => {
    if (input.trim()) { // Check if input is not just empty spaces
      // Add the new message to the messages array
      setMessages([...messages, { text: input, sender: "You" }]);
      setInput(""); // Clear the input field after sending the message
    }
  };

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="chat-header">
        <div className="logo">Aislo</div> {/* Displaying the chat logo */}
        <button className="profile-icon" onClick={() => navigate("/login")}>
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>

      {/* Chat Box */}
      <div className="chat-box">
        <p>Grocery Shopping Assistance</p> {/* Placeholder text for the chat */}
      </div>

      {/* Input Field for typing messages */}
      <div className="chat-input">
        <input
          type="text"
          value={input} // Bind input field to state
          onChange={(e) => setInput(e.target.value)} // Update input state on text change
          placeholder="Start typing..." // Placeholder text in the input field
        />
      </div>

      {/* Footer Section */}
      <div className="chat-footer"></div> 
    </div>
  );
};

export default Chat; 