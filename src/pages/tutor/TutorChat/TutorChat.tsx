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
import VideoCall from "./VideoCall";

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

  const [isInCall, setIsInCall] = useState(false);
  const [isCallPending, setIsCallPending] = useState(false);

  function generateRoomID(chatId: string, userId: string, studentId: string) {
    const cleanChatId = chatId.toString().replace(/[^a-zA-Z0-9]/g, "");
    const cleanUserId = userId.toString().replace(/[^a-zA-Z0-9]/g, "");
    const cleanStudentId = studentId.toString().replace(/[^a-zA-Z0-9]/g, "");
    return `room${cleanChatId.slice(0, 8)}${cleanUserId.slice(
      0,
      8
    )}${cleanStudentId.slice(0, 8)}`;
  }

  const handleStartCall = () => {
    if (!selectedChat || !userInfo?._id) return;

    const roomID = generateRoomID(
      selectedChat._id,
      userInfo._id,
      selectedChat.studentId._id
    );

    socket.emit("video-call-invitation", {
      to: selectedChat.studentId._id,
      from: userInfo._id,
      roomID: roomID,
      fromName: userInfo.name,
    });

    setIsCallPending(true);
    showSnackbar("Calling student...", "success");

    const callUrl = `/video-call?roomID=${roomID}&userId=${userInfo._id}`;
    window.open(callUrl, "_blank");
  };

  useEffect(() => {
    socket.on("video-call-invitation", (data) => {
      const { roomID, from, fromName } = data;

      const acceptCall = () => {
        const callUrl = `/video-call?roomID=${roomID}&userId=${userInfo?._id}`;
        window.open(callUrl, "_blank");
        socket.emit("video-call-accepted", { to: from }); // Add acceptance confirmation
      };

      if (Notification.permission === "granted") {
        const notification = new Notification("Incoming Video Call", {
          body: `${fromName} is calling you`,
        });

        notification.onclick = () => {
          notification.close();
          acceptCall();
        };
      }

      showSnackbar(`Incoming call from ${fromName}`, "success");
    });

    socket.on("video-call-rejected", () => {
      setIsCallPending(false);
      showSnackbar("Call was declined", "error");
    });

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      socket.off("video-call-invitation");
      socket.off("video-call-rejected");
    };
  }, [userInfo, showSnackbar]);

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

  // const handleStartCall = () => {
  //   setIsInCall(true);
  //   // Optionally notify the other user through socket
  //   socket.emit("call-initiated", {
  //     to: selectedChat.studentId._id,
  //     roomId: `${selectedChat._id}-${userInfo?._id}-${selectedChat.studentId._id}`,
  //   });
  // };

  // useEffect(() => {
  //   socket.on("call-initiated", (data) => {
  //     console.log("call initiated", data);
  //     // You could show a notification or automatically join the call
  //     showSnackbar("Incoming video call...", "success");
  //     setIsInCall(true);
  //   });

  //   return () => {
  //     socket.off("call-initiated");
  //   };
  // }, []);

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
      if (
        selectedChat &&
        message.chatId === selectedChat._id &&
        message.senderId != userInfo?._id
      ) {
        setMessages((prev) => [...prev, message]);
        // if (Notification.permission === "granted") {
        //   new Notification("New Message", {
        //     body: `${message.content}`,
        //   });
        // }
      }
    },
    [selectedChat]
  );

  useEffect(() => {
    if (userInfo?._id) {
      socket.on("receive_message", handleReceiveMessage);
      // if (Notification.permission === "default") {
      //   Notification.requestPermission();
      // }
    }

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [userInfo?._id, handleReceiveMessage]);

  return (
    <div className="tutC-tutor-chat">
      <ChatList chats={chats} onChatSelect={handleChatSelect} />
      <div className="tutC-chat-content">
        {isInCall ? (
          <VideoCall
            selectedChat={selectedChat}
            currentUserId={userInfo?._id as string}
            onEndCall={() => setIsInCall(false)}
          />
        ) : (
          <>
            <ChatWindow
              messages={messages}
              selectedChat={selectedChat}
              currentUserId={userInfo?._id as string}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              selectedChat={selectedChat}
              currentUserId={userInfo?._id as string}
              onStartCall={handleStartCall}
            />
          </>
        )}
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
