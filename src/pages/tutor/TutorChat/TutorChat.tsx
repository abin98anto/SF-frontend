import React, { useCallback, useEffect, useState } from "react";

import "./TutorChat.scss";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import axiosInstance from "../../../utils/axiosConfig";
import { useAppSelector } from "../../../hooks/hooks";
import { AppRootState } from "../../../redux/store";
import { UserDetails } from "../../../entities/user/UserDetails";
import { Course } from "../../../entities/courses/Course";
import { IMessage } from "../../../entities/messages/IMessages";
import { socket } from "../../../utils/socketConfig";
import { someMessages } from "../../../utils/constants";
import { useSnackbar } from "../../../hooks/useSnackbar";
import CustomSnackbar from "../../../components/Snackbar/CustomSnackbar";

interface Chat {
  _id: number;
  tutorId: UserDetails;
  studentId: UserDetails;
  courseId: Course;
  messages: IMessage[];
}

const TutorChat: React.FC = () => {
  const { userInfo } = useAppSelector((state: AppRootState) => state.tutor);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  const fetchChatsList = async (userId: string) => {
    try {
      const fetchResult = await axiosInstance.get(
        `/m/chats-list?userId=${userId}`
      );
      setChats(fetchResult.data);
      setMessages(fetchResult.data.messages || []);
    } catch (error) {
      console.error(someMessages.CHATS_FETCH_FAIL, error);
      showSnackbar(someMessages.CHATS_FETCH_FAIL, "error");
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchChatsList(userInfo._id as string);
    }
  }, [userInfo]);

  const [selectedChat, setSelectedChat] = useState<any>(null);

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    setMessages(chat.messages);
  };

  const handleSendMessage = async (message: string) => {
    if (chats) {
      try {
        const newMsg: IMessage = {
          chatId: selectedChat._id as string,
          senderId: userInfo?._id as string,
          receiverId: selectedChat.studentId._id,
          content: message,
          contentType: "text",
          isRead: false,
          timestamp: new Date(),
        };

        await axiosInstance.post("/m/send-message", newMsg);
        setMessages([...messages, newMsg]);
      } catch (error) {
        console.error(someMessages.SND_MSG_FAIL, error);
        showSnackbar(someMessages.SND_MSG_FAIL, "error");
      }
    }
  };

  const handleReceiveMessage = useCallback(
    (message: IMessage) => {
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${message.content}`,
          });
        }
      }
    },
    [selectedChat]
  );

  useEffect(() => {
    if (userInfo?._id) {
      socket.on("receive_message", handleReceiveMessage);
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [userInfo?._id, handleReceiveMessage]);

  return (
    <div className="tutC-tutor-chat">
      <ChatList chats={chats} onChatSelect={handleChatSelect} />
      <div className="tutC-chat-content">
        <ChatWindow
          messages={messages}
          selectedChat={selectedChat}
          currentUserId={userInfo?._id as string}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </div>
  );
};

export default TutorChat;
