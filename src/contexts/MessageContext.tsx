import { createContext } from "react";

interface MessageContextType {
  messages: any[];
  addMessage: (message: any) => void;
}

export const MessageContext = createContext<MessageContextType>({
  messages: [],
  addMessage: () => {},
});
