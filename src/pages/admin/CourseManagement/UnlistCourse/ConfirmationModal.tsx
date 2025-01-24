import React from "react";
import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="cm-modal-overlay" onClick={onClose}>
      <div className="cm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="cm-modal-header">
          <h2>{title}</h2>
        </div>
        <div className="cm-modal-body">{message}</div>
        <div className="cm-modal-footer">
          <button className="cm-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="cm-confirm-btn" onClick={onConfirm}>
            Yes, Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
