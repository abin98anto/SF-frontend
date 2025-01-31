import type React from "react";
import { useEffect } from "react";
import "./TutorChat.scss";
import { UserDetails } from "../../../entities/user/UserDetails";
import { Course } from "../../../entities/courses/Course";
import { IMessage } from "../../../entities/messages/IMessages";

interface Chat {
  _id: number;
  tutorId: UserDetails;
  studentId: UserDetails;
  courseId: Course;
  messages: IMessage[];
}

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onChatSelect }) => {
  useEffect(() => {
  }, []);
  return (
    <div className="tutC-chat-list">
      {chats.map((chat: any) => (
        <div
          key={chat._id}
          className="tutC-chat-item"
          onClick={() => onChatSelect(chat)}
        >
          <img
            className="tutC-chat-avatar"
            src={chat.studentId.profilePicture}
            alt="Avatar"
          />
          <div className="tutC-chat-info">
            <h3>{chat.studentId.name}</h3>
            <p>{chat.courseId.basicInfo.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
