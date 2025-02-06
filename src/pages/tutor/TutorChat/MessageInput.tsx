// MessageInput.tsx
import React, { useState } from "react";
import { UserDetails } from "../../../entities/user/UserDetails";
import { Course } from "../../../entities/courses/Course";

interface Chat {
  _id: number;
  tutorId: UserDetails;
  studentId: UserDetails;
  courseId: Course;
  messages: string[];
}

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  selectedChat: Chat | null;
  currentUserId: string;
  onStartCall: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  selectedChat,
  currentUserId,
  onStartCall,
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return !selectedChat ? null : (
    <form className="tutC-message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
      {selectedChat.tutorId._id === currentUserId && (
        <button
          type="button"
          className="tutC-video-call-btn"
          onClick={onStartCall}
        >
          Start Video Call
        </button>
      )}
    </form>
  );
};

export default MessageInput;
