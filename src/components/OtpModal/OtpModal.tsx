import React from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { signupMessages } from "../../utils/constants";

interface OTPModalProps {
  open: boolean;
  onClose: () => void;
  submittedEmail: string;
  otpValue: string;
  setOtpValue: (value: string) => void;
  timer: number;
  handleOTPSubmit: () => void;
  handleResendOTP: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  open,
  onClose,
  submittedEmail,
  otpValue,
  setOtpValue,
  timer,
  handleOTPSubmit,
  handleResendOTP,
}) => {
  const otpModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={otpModalStyle}>
        <Typography variant="h6" component="h2">
          Enter OTP
        </Typography>
        <Typography sx={{ mt: 2 }}>
          A verification code has been sent to {submittedEmail}.
        </Typography>
        <TextField
          fullWidth
          label="OTP"
          value={otpValue}
          onChange={(e) => setOtpValue(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          {timer > 0
            ? `OTP expires in ${timer} seconds`
            : signupMessages.OTP_EXPIRED}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOTPSubmit}
          sx={{ mt: 2 }}
          disabled={timer <= 0}
        >
          Verify OTP
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleResendOTP}
          disabled={timer > 0}
          sx={{
            mt: 2,
            textTransform: "none",
            ...(timer > 0 && { opacity: 0.7, pointerEvents: "none" }),
          }}
        >
          Resend OTP
        </Button>
      </Box>
    </Modal>
  );
};

export default OTPModal;
