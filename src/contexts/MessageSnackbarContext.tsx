import type React from "react";
import { createContext, useState, useCallback } from "react";

interface MessageSnackbarContextType {
  showMessageSnackbar: (message: string) => void;
  message: string | null;
}

export const MessageSnackbarContext = createContext<MessageSnackbarContextType>(
  {
    showMessageSnackbar: () => {},
    message: null,
  }
);

export const MessageSnackbarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [message, setMessage] = useState<string | null>(null);

  const showMessageSnackbar = useCallback((newMessage: string) => {
    setMessage(newMessage);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  return (
    <MessageSnackbarContext.Provider value={{ showMessageSnackbar, message }}>
      {children}
    </MessageSnackbarContext.Provider>
  );
};
