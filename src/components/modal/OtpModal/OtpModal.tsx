import React from "react";
import "./OtpModal.scss";

interface OtpModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  isSubmitting: boolean;
}

const OtpModal: React.FC<OtpModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [otp, setOtp] = React.useState("");

  if (!isVisible) return null;

  return (
    <div className="otp-modal">
      <div className="modal-content">
        <h2>Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="otp-input"
        />
        <button onClick={() => onSubmit(otp)} disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
