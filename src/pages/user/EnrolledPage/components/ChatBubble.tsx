import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import "./ChatBubble.scss";
import type { AppRootState } from "../../../../redux/store";
import { useAppSelector } from "../../../../hooks/hooks";
import axiosInstance from "../../../../utils/axiosConfig";
import { IMessage } from "../../../../entities/messages/IMessages";
import { IChat } from "../../../../entities/messages/IChat";
import { socket } from "../../../../utils/socketConfig";

interface ChatBubbleProps {
  courseId: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ courseId }) => {
  const { userInfo } = useAppSelector((state: AppRootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [chatData, setChatData] = useState<IChat | null>(null);
  const [tutorName, setTutorName] = useState<string | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchChat = async (courseId: string, userId: string) => {
    try {
      const fetchResult = await axiosInstance.post("/m/user-chat", {
        courseId,
        userId,
      });
      setChatData(fetchResult.data);
      setTutorName(fetchResult.data.tutorId.name);
      setMessages(fetchResult.data.messages || []);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() && chatData) {
      const newMsg: IMessage = {
        chatId: chatData._id as string,
        senderId: userInfo?._id as string,
        receiverId: chatData.tutorId,
        content: newMessage,
        contentType: "text",
        isRead: false,
        timestamp: new Date(),
      };

      try {
        await axiosInstance.post("/m/send-message", newMsg);
        setMessages([...messages, newMsg]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleReceiveMessage = useCallback(
    (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${tutorName}: ${message.content}`,
          });
        }
      }
    },
    [isOpen, tutorName]
  );

  useEffect(() => {
    if (userInfo?._id) {
      fetchChat(courseId, userInfo._id);
      socket.on("receive_message", handleReceiveMessage);
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [courseId, userInfo?._id, handleReceiveMessage]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="chat-overlay" onClick={() => setIsOpen(false)} />
      )}
      <div className={`chat-bubble-container ${isOpen ? "open" : ""}`}>
        {isOpen ? (
          <div className="chat-window">
            <div className="chat-header">
              <h3>{tutorName ? tutorName : "Tutor Chat"}</h3>
              <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                <X size={20} />
              </button>
            </div>
            <div className="chat-messages">
              {messages.length === 0 && <p>Say hi to your personal tutor</p>}
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.senderId === userInfo?._id ? "sent" : "received"
                  }`}
                >
                  {msg.content}
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
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
        )}
      </div>
    </>
  );
};

export default ChatBubble;
