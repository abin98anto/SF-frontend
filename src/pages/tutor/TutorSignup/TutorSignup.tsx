import "./TutorSignup.scss";
import { tutorSignUpSchema } from "../../../schemas/tutorSignUpSchema";
import { imageLinks, signupMessages } from "../../../utils/constants";
import { handleFileUpload, validatePdfFile } from "../../../utils/fileUpload";
import { TutorSignUpFormValues } from "../../../entities/tutor/TutorSignUpFormValues";
import { TutorSignUpDummy } from "../../../entities/tutor/TutorSignUpDummy";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  signUpTutor,
  verifyTutorOTP,
} from "../../../redux/features/tutor/tutorSlice";

import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

const SignupPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.tutor);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<TutorSignUpFormValues>({
    resolver: yupResolver(tutorSignUpSchema),
  });

  const [tutorDetails, setTutorDetails] =
    useState<TutorSignUpFormValues | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false);
  const [openErrorToast, setOpenErrorToast] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // File input function.
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await handleFileUpload(file, {
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
        validateFile: validatePdfFile,
      });

      if (result.success && result.url) {
        setValue("resume", result.url);
      } else {
        alert(result.error || "Upload failed");
      }
    }
  };

  // Autofill function.
  const handleAutofill = () => {
    const autofillData = TutorSignUpDummy();
    (Object.keys(autofillData) as Array<keyof TutorSignUpFormValues>).forEach(
      (key) => {
        const currentValue = getValues(key);
        if (!currentValue) {
          setValue(key, autofillData[key]);
        }
      }
    );
  };

  // Form submission.
  const onSubmit: SubmitHandler<TutorSignUpFormValues> = async (data) => {
    setTutorDetails(data);
    setSubmittedEmail(data.email);

    const result = await dispatch(signUpTutor(data));

    if (signUpTutor.fulfilled.match(result)) {
      handleOTPModalOpen();
    } else {
      const errorPayload = result.payload as { message?: string };

      if (errorPayload?.message === signupMessages.EMAIL_EXISTS) {
        setErrorMessage(signupMessages.EMAIL_EXISTS);
        setOpenErrorToast(true); // Ensure this is always set for Snackbar
      } else {
        setErrorMessage(signupMessages.UNKOWN_ERROR);
        setOpenErrorToast(true); // Show generic error if no specific match
      }
    }
  };

  // OTP submission.
  const handleOTPSubmit = async () => {
    if (timer <= 0) {
      setErrorMessage(signupMessages.OTP_EXPIRED);
      setOpenErrorToast(true);
      return;
    }

    try {
      const result = await dispatch(
        verifyTutorOTP({
          email: submittedEmail,
          otp: otpValue,
        })
      );

      console.log("resullllt", result);
      if (verifyTutorOTP.fulfilled.match(result)) {
        navigate("/tutor/login");
      } else {
        // setErrorMessage(result.payload || signupMessages.UNKNOWN_ERROR);
        // setErrorMessage(result.payload || signupMessages.UNKOWN_ERROR);
        // setOpenErrorToast(true);
        if (result.payload === signupMessages.WRONG_OTP) {
          setErrorMessage(signupMessages.WRONG_OTP);
        } else if (result.payload === signupMessages.OTP_EXPIRED) {
          setErrorMessage(signupMessages.OTP_EXPIRED);
        } else {
          setErrorMessage(signupMessages.UNKOWN_ERROR);
        }
        setOpenErrorToast(true);
      }
    } catch (err) {
      console.error(signupMessages.UNKOWN_ERROR, err);
      setErrorMessage(signupMessages.UNKOWN_ERROR);
      setOpenErrorToast(true);
    } finally {
      setOtpValue("");
    }
  };

  // Resend OTP.
  const handleResendOTP = async () => {
    if (!tutorDetails) {
      setOpenErrorToast(true);
      setErrorMessage(signupMessages.USER_NOT_FOUND);
      return;
    }

    try {
      await dispatch(signUpTutor(tutorDetails));
      setTimer(90);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1 && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(signupMessages.UNKOWN_ERROR, err);
      setOpenErrorToast(true);
      setErrorMessage(signupMessages.RESEND_OTP_FAIL);
    }
  };

  // Open OTP modal.
  const handleOTPModalOpen = () => {
    setOpenOTPModal(true);
    setTimer(90);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1 && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Close OTP modal.
  const handleOTPModalClose = () => {
    setOpenOTPModal(false);
    setOtpValue("");
    setErrorMessage("");
    setTimer(90);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Close Error Toast.
  const handleCloseErrorToast = () => {
    setOpenErrorToast(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

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
    <>
      <div className="heading">SkillForge</div>
      <div className="signup-page">
        <div className="signup-form">
          <div className="form-container">
            <p className="title">Tutor Sign up</p>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {/* Username */}
              <input
                {...register("name")}
                className={`input ${errors.name ? "error" : ""}`}
                placeholder="Name"
              />
              {errors.name && (
                <p className="error-message">{errors.name.message}</p>
              )}

              {/* Email */}
              <input
                {...register("email")}
                type="email"
                className={`input ${errors.email ? "error" : ""}`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}

              {/* Password */}
              <input
                {...register("password")}
                type="password"
                className={`input ${errors.password ? "error" : ""}`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}

              {/* Confirm Password */}
              <input
                {...register("confirmPassword")}
                type="password"
                className={`input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="error-message">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* Resume upload. */}
              <input
                type="file"
                {...register("resume")}
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept="application/pdf"
              />
              <button
                className="button"
                onClick={triggerFileInput}
                type="button"
                disabled={isUploading}
              >
                <svg xmlns={imageLinks.GOOGLE_SVG}>
                  <rect className="border" pathLength={100} />
                  <rect className="loading" pathLength={100} />
                  <svg
                    className="done-svg"
                    xmlns={imageLinks.GOOGLE_SVG}
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="done done-cloud"
                      pathLength={100}
                      d={imageLinks.D_CLOUD}
                    />
                    <path
                      className="done done-check"
                      pathLength={100}
                      d={imageLinks.D_CHECK}
                    />
                  </svg>
                </svg>
                <div className="txt-upload">
                  {isUploading ? "Uploading..." : "Upload Resume (PDF)"}
                </div>
              </button>
              {errors.resume && (
                <p className="error-message">{errors.resume.message}</p>
              )}

              {/* Submit Button */}
              <button type="submit" className="form-btn" disabled={isUploading}>
                {isUploading || loading ? "Processing..." : "Sign up"}
              </button>
            </form>

            <p className="sign-up-label">
              Already have an account?
              <span
                className="sign-up-link"
                onClick={() => navigate("/tutor/login")}
              >
                Login
              </span>
            </p>

            <div className="buttons-container">
              {/* Autofill Button */}
              <button
                type="button"
                onClick={handleAutofill}
                className="autofill-btn"
              >
                Autofill
              </button>
            </div>
          </div>
        </div>
        <div className="signup-image">
          <img src={imageLinks.TUTOR_SIGNUP} alt="Signup" />
        </div>
        {/* OTP Modal */}
        <Modal open={openOTPModal} onClose={handleOTPModalClose}>
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
        ;{/* Error Snackbar */}
        <Snackbar
          open={openErrorToast}
          autoHideDuration={6000}
          onClose={handleCloseErrorToast}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleCloseErrorToast} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default SignupPage;
