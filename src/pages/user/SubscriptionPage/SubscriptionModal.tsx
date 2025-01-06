import React from "react";
import "./Modal.scss";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="modal-button">
          OK
        </button>
      </div>
    </div>
  );
};
