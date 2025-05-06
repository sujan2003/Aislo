import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Header from "./Header";
import "./Chat.css";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // <-- initialize navigate here

  // Check auth state on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });
    return unsubscribe;
  }, [navigate]);

  // Add the logo link with auth check
  const renderLogo = () => (
    <Link 
      to="/chat" 
      className="logo"
      onClick={(e) => {
        if (!auth.currentUser) {
          e.preventDefault();
          navigate('/login');
        }
      }}
    >
      Aislo
    </Link>
  );
  
  const updateInput = (event) => {
    setInput(event.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const loadingMessage = { sender: "bot", text: "Typing...", isLoading: true };
    const loadingIndex = messages.length;

    setMessages((prev) => [...prev, loadingMessage]);
    setLoading(true);
    setLoadingMessageId(loadingIndex);

    try {
      const response = await axios.post("http://localhost:4000/api/data", { input });
      const botMessage = { sender: "bot", text: response.data.message };

      setMessages((prev) => {
        const updated = [...prev];
        updated[loadingIndex] = botMessage;
        return updated;
      });
    } catch (error) {
      const errorMessage = { sender: "bot", text: "Error fetching data from the server" };
      setMessages((prev) => {
        const updated = [...prev];
        updated[loadingIndex] = errorMessage;
        return updated;
      });
    } finally {
      setLoading(false);
      setLoadingMessageId(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return <div className="loading-screen">Checking authentication...</div>;
  }

  return (
    <div className="chat-container">
      <Header onLogout={handleLogout} user={user} renderLogo={renderLogo} />

      <div className="chat-wrapper">
        <div className="chat-box scrollable">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-box">
          <p>Grocery Shopping Assistance</p>
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={updateInput}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Start typing..."
          />
          <button onClick={handleSubmit}>Send</button>
        </div>

        <div className="chat-footer"></div>
      </div>
    </div>
  );
};

export default Chat;
