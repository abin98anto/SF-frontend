import React from "react";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalButtonGroup,
  Button,
} from "../StyledComponents";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalTitle>{title}</ModalTitle>
        <p>{message}</p>
        <ModalButtonGroup>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </ModalButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};
