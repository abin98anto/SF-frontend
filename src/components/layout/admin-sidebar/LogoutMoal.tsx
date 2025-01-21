import "./logout-modal.scss";

type LogoutModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({
  isVisible,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isVisible) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="admin-modal-actions">
          <button onClick={onConfirm} className="admin-confirm-button">
            Yes, Logout
          </button>
          <button onClick={onClose} className="admin-cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
