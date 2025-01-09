import React, { useState } from "react";

import "./ChatBubble.scss";

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, newMessage]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-bubble-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Course Chat</h3>

            <button onClick={() => setIsOpen(false)}>&times;</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                {msg}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />

            <button type="submit">Send</button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button className="chat-bubble" onClick={() => setIsOpen(true)}>
          <span>Chat</span>
        </button>
      )}
    </div>
  );
};

export default ChatBubble;
