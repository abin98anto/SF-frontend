import React, { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import "./ChatBubble.scss";

const ChatBubble: React.FC = () => {
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
    <>
      {isOpen && (
        <div className="chat-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div className={`chat-bubble-container ${isOpen ? "open" : ""}`}>
        {isOpen ? (
          <div className="chat-window">
            <div className="chat-header">
              <h3>Tutor Chat</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
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
                aria-label="Type a message"
              />
              <button type="submit" aria-label="Send message">
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            className="chat-bubble"
            onClick={() => setIsOpen(true)}
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </button>
        )}
      </div>
    </>
  );
};

export default ChatBubble;
