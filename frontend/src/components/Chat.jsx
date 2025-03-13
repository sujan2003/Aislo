// https://www.dhiwise.com/post/how-to-build-a-real-time-react-chat-application

import {useNavigate} from "react-router-dom"; // Import useNavigate hook
import { Link } from "react-router-dom";
import React, { useState } from "react"; // Import React and useState hook
import "./Chat.css"; // Import CSS file for styling
import axios from "axios";

const Chat = () => {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  
  const updateInput = (event) => {
    setInput(event.target.value); // Update input state on text change
  }

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:4000/api/data", { input: input })
      .then(response => {
        setOutput(response.data.message)
      })
    }
    catch (error) {
      setError("Error fetching data from the server");
    }
  }

  return (
    <div className="chat-container">
      {/* Header Section */}
      <div className="chat-header">
      <Link to="/chat" className="logo">Aislo</Link> {/* Displaying the chat logo */}
      <Link to="/signup" className="profile-icon">
        <span className="material-symbols-outlined">account_circle</span>
      </Link> {/* Displaying the chat logo */}
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
          onChange={updateInput} // Update input state on text change
          placeholder="Start typing..." // Placeholder text in the input field
        />
        <button onClick={handleSubmit}>Send</button>
      </div>

      {/* Chat response Box */}
      <div className="chat-box">
        {output.length > 0 ? <p>{output}</p>: <p>{error}</p>}
      </div>

      {/* Footer Section */}
      <div className="chat-footer"></div> 
    </div>
  );
};

export default Chat; 