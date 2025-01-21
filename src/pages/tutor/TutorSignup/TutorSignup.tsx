import "./TutorSignup.scss";
import { imageLinks, someMessages } from "../../../utils/constants";
import { useAppDispatch } from "../../../hooks/hooks";
import {
  signUpUser,
  verifyOTP,
} from "../../../redux/services/UserSignupServices";

import React, { useEffect, useRef, useState } from "react";
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
import { signUpSchema } from "../../../entities/schemas/signUpSchema";
import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
import { UserRole } from "../../../entities/user/UserRole";
import { TutorDummy } from "../../../entities/dummys/TutorDummy";
import { useSelector } from "react-redux";
import { AppRootState } from "../../../redux/store";

const SignupPage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: AppRootState) => state.tutor);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/tutor/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
  });

  const [tutorDetails, setTutorDetails] = useState<SignUpFormValues | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false);
  const [openErrorToast, setOpenErrorToast] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [timer, setTimer] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Autofill function.
  const handleAutofill = () => {
    const autofillData = TutorDummy();
    (Object.keys(autofillData) as Array<keyof SignUpFormValues>).forEach(
      (key) => {
        const currentValue = getValues(key);
        if (!currentValue) {
          setValue(key, autofillData[key]);
        }
      }
    );
  };

  // Form submission.
  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    try {
      setSubmittedEmail(data.email);
      const formData = { ...data, role: UserRole.TUTOR };
      setTutorDetails(formData);
      const result = await dispatch(signUpUser(formData)).unwrap();

      if (result.message === someMessages.OTP_SENT) {
        handleOTPModalOpen();
      } else if (result.message === someMessages.EMAIL_EXISTS) {
        setErrorMessage(someMessages.EMAIL_EXISTS);
        setOpenErrorToast(true);
      } else {
        setErrorMessage(someMessages.UNKOWN_ERROR);
        setOpenErrorToast(true);
      }
    } catch (err) {
      console.error(someMessages.UNKOWN_ERROR, err);
      err === someMessages.EMAIL_EXISTS
        ? setErrorMessage(someMessages.EMAIL_EXISTS)
        : setErrorMessage(someMessages.UNKOWN_ERROR);

      setOpenErrorToast(true);
    }
  };

  // OTP submission.
  const handleOTPSubmit = async () => {
    if (timer <= 0) {
      setErrorMessage(someMessages.OTP_EXPIRED);
      setOpenErrorToast(true);
      return;
    }

    try {
      const result = await dispatch(
        verifyOTP({
          email: submittedEmail,
          otp: otpValue,
        })
      );

      if (verifyOTP.fulfilled.match(result)) {
        navigate("/tutor/login");
      } else {
        if (result.payload === someMessages.WRONG_OTP) {
          setErrorMessage(someMessages.WRONG_OTP);
        } else if (result.payload === someMessages.OTP_EXPIRED) {
          setErrorMessage(someMessages.OTP_EXPIRED);
        } else {
          setErrorMessage(someMessages.UNKOWN_ERROR);
        }
        setOpenErrorToast(true);
      }
    } catch (err) {
      console.error(someMessages.UNKOWN_ERROR, err);
      setErrorMessage(someMessages.UNKOWN_ERROR);
      setOpenErrorToast(true);
    } finally {
      setOtpValue("");
    }
  };

  // Resend OTP.
  const handleResendOTP = async () => {
    if (!tutorDetails) {
      setOpenErrorToast(true);
      setErrorMessage(someMessages.USER_NOT_FOUND);
      return;
    }

    try {
      await dispatch(signUpUser(tutorDetails));
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
      console.error(someMessages.UNKOWN_ERROR, err);
      setOpenErrorToast(true);
      setErrorMessage(someMessages.RESEND_OTP_FAIL);
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

              {/* Submit ButtouseAppSelectorn */}
              <button type="submit" className="form-btn">
                Sign up
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
                : someMessages.OTP_EXPIRED}
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
