import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AppRootState } from "../../../redux/store";
import {
  forgotPassword,
  setPassword,
} from "../../../redux/services/UserPasswordService";
import { validateEmail } from "../../../utils/form-checks/validateEmail";
import { someMessages } from "../../../utils/constants";
import { Snackbar, Alert } from "@mui/material";
import "./ForgotPasswordModal.scss";

interface ForgotPasswordModalProps {
  show: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  show,
  onClose,
}) => {
  const dispatch = useDispatch<ThunkDispatch<AppRootState, any, any>>();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(120);
  const [_, setCanResendOtp] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const resetForm = () => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSent(false);
    setTimer(120);
    setCanResendOtp(false);
    setSendingOtp(false);
    setSettingPassword(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackError = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "error",
    });
  };

  const showSnackSuccess = (message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: "success",
    });
  };

  const handleSendOtp = async () => {
    if (!email.trim()) {
      showSnackError(someMessages.EMAIL_REQUIRED);
      return;
    }

    if (!validateEmail(email)) {
      showSnackError(someMessages.INVALID_EMAIL);
      return;
    }

    setSendingOtp(true);

    try {
      const response = await dispatch(forgotPassword(email));

      if (response.payload === someMessages.EMAIL_NOT_FOUND) {
        showSnackError(someMessages.EMAIL_NOT_FOUND);
      } else {
        setOtpSent(true);
        setTimer(120);
        setCanResendOtp(false);
        showSnackSuccess(someMessages.OTP_SENT);
      }
    } catch (err) {
      console.log(someMessages.FORGOT_PASS_FAIL, err);
      showSnackError(someMessages.FORGOT_PASS_FAIL);
    } finally {
      setSendingOtp(false);
    }
  };

  const validateFields = () => {
    if (!otp.trim()) {
      showSnackError(someMessages.OTP_REQ);
      return false;
    }
    if (!newPassword.trim()) {
      showSnackError(someMessages.PASS_REQUIRED);
      return false;
    }
    if (!confirmPassword.trim()) {
      showSnackError(someMessages.CONFIRM_PASS_REQ);
      return false;
    }
    if (newPassword !== confirmPassword) {
      showSnackError(someMessages.PASSWORD_MISMATCH);
      return false;
    }
    if (newPassword.length < 8) {
      showSnackError(someMessages.PASSWORD_WEAK);
      return false;
    }
    return true;
  };

  const handleSetNewPassword = async () => {
    if (!validateFields()) return;

    setSettingPassword(true);

    try {
      const response = await dispatch(
        setPassword({ email, otp, password: newPassword })
      );

      if (response.payload === someMessages.INVALID_OTP) {
        showSnackError(someMessages.INVALID_OTP);
        setSettingPassword(false);
        return;
      }

      showSnackSuccess(someMessages.PASS_CHANGE_SUCC);
      setTimeout(() => {
        handleModalClose();
      }, 3000);
    } catch (err) {
      console.log(someMessages.SET_PASS_FAIL, err);
      showSnackError(someMessages.SET_PASS_FAIL);
      setSettingPassword(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!show) return null;

  return (
    <div className="fp-modal-overlay">
      <div className="fp-modal-content">
        <h2 className="fp-title">Forgot Password</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
          className="fp-input"
        />
        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="fp-button"
            disabled={sendingOtp}
          >
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : (
          <>
            <div className="fp-timer">
              {timer > 0 ? (
                `Resend OTP in ${formatTime(timer)}`
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="fp-button fp-button-resend"
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending OTP..." : "Resend OTP"}
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="fp-input"
              disabled={settingPassword}
              maxLength={6}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="fp-input"
              disabled={settingPassword}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="fp-input"
              disabled={settingPassword}
            />
            <button
              onClick={handleSetNewPassword}
              className="fp-button"
              disabled={settingPassword}
            >
              {settingPassword ? "Setting New Password..." : "Set New Password"}
            </button>
          </>
        )}
        <button
          onClick={handleModalClose}
          className="fp-button fp-button-close"
          disabled={sendingOtp || settingPassword}
        >
          Close
        </button>
      </div>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ForgotPasswordModal;
