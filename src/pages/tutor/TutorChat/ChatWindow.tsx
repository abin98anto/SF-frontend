import type React from "react";
import type { IMessage } from "../../../entities/messages/IMessages";
import type { UserDetails } from "../../../entities/user/UserDetails";
import type { Course } from "../../../entities/courses/Course";

interface Chat {
  _id: number;
  tutorId: UserDetails;
  studentId: UserDetails;
  courseId: Course;
  messages: string[];
}

interface ChatWindowProps {
  messages: IMessage[];
  selectedChat: Chat | null;
  currentUserId: string | undefined;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  selectedChat,
  currentUserId,
}) => {
  if (!selectedChat) {
    return (
      <div className="tutC-chat-window">
        <div className="tutC-empty-state">Select a chat to start messaging</div>
      </div>
    );
  }

  return (
    <div className="tutC-chat-window">
      <div className="tutC-chat-header">
        <img
          className="tutC-chat-avatar"
          src={selectedChat.studentId.profilePicture!}
          alt="Avatar"
        />
        <h2>{selectedChat.studentId.name}</h2>
        <p>{selectedChat.courseId.basicInfo.title}</p>
      </div>
      <div className="tutC-message-list">
        {messages.length === 0 && <p>No messages yet</p>}
        {messages.map((message: IMessage) => {
          const isSentByCurrentUser = message.senderId === currentUserId;
          return isSentByCurrentUser ? (
            <div key={message._id} className="tutC-message tutC-sent">
              <p>{message.content}</p>
              <span className="tutC-timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ) : (
            <div key={message._id} className="tutC-message tutC-received">
              <p>{message.content}</p>
              <span className="tutC-timestamp">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatWindow;
