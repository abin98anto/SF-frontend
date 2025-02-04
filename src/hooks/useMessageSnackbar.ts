import { useContext } from "react";
import { MessageSnackbarContext } from "../contexts/MessageSnackbarContext";

export const useMessageSnackbar = () => {
  const context = useContext(MessageSnackbarContext);
  if (!context) {
    throw new Error(
      "useMessageSnackbar must be used within a MessageSnackbarProvider"
    );
  }
  return context;
};
