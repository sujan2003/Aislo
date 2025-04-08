// https://www.dhiwise.com/post/how-to-build-a-real-time-react-chat-application

import { Link } from "react-router-dom";
import React, {useState } from "react"; // Import React and useState hook
import "./Chat.css"; // Import CSS file for styling
import axios from "axios";

const Chat = () => {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState("");
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState();
  
  const updateInput = (event) => {
    setInput(event.target.value); // Update input state on text change
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInput("");
    setLoading(true)
    try {
      await axios.post("http://localhost:4000/api/data", { input: input })
      .then(response => {
        setOutput(response.data.message)
      })
      setLoading(false);
    }
    catch (error) {
      setError("Error fetching data from the server");
    }
  }


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
        {Loading? <p>Loading...</p>: <p></p>}
        {output.length > 0 ? <p>{output}</p>: <p>{error}</p>}
      </div>

      {/* Footer Section */}
      <div className="chat-footer"></div> 
    </div>
  );
};

export default Chat;