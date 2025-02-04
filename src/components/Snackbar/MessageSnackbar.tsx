import type React from "react";
import { useContext } from "react";
import "./MessageSnackbar.scss";
import { MessageSnackbarContext } from "../../contexts/MessageSnackbarContext";

export const MessageSnackbar: React.FC = () => {
  const { message } = useContext(MessageSnackbarContext);

  if (!message) return null;

  return (
    <div className="message-snackbar">
      <p>{message}</p>
    </div>
  );
};
