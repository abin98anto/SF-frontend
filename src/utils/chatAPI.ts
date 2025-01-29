import { IChat } from "../entities/messages/IChat";
import { IMessage } from "../entities/messages/IMessages";
import axiosInstance from "./axiosConfig";

const createChat = async (chat: IChat) => {
  try {
    const response = await axiosInstance.post("/m/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chat),
    });

    if (response) {
      const newChat = await response.data;
      return newChat;
    } else {
      throw new Error("Error creating chat");
    }
  } catch (error) {
    console.error("error creating chat in chatAPI", error);
  }
};

const sendMessage = async (message: IMessage) => {
  try {
    const response = await axiosInstance.post("/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (response) {
      const responseMessage = await response.data;
      return responseMessage;
    } else {
      throw new Error("Error sending message");
    }
  } catch (error) {
    console.error("error in sendMessage in chatAPI", error);
  }
};

export { createChat, sendMessage };
