import "./chat-box.scss";

export function ChatBox() {
  return (
    <div className="chatBox">
      <div className="header">
        <h3>Course Chat</h3>
      </div>
      <div className="messages">{/* Messages will be populated here */}</div>
      <div className="input">
        <input type="text" placeholder="Type your message..." />
        <button>Send</button>
      </div>
    </div>
  );
}
