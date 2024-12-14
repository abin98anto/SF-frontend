import "./SignupPage.scss";
import { signUpSchema } from "../../../schemas/signUpSchema";
import { imageLinks, signupMessages } from "../../../utils/constants";
import { handleFileUpload, validateImageFile } from "../../../utils/fileUpload";
import { SignUpFormValues } from "../../../entities/SignUpFormValues";
import { SignUpDummy } from "../../../entities/SignUpDummy";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { signUpUser, verifyOTP } from "../../../redux/features/userSlice";

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
  const { loading, error } = useAppSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [openOTPModal, setOpenOTPModal] = useState<boolean>(false);
  const [openErrorToast, setOpenErrorToast] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const result = await handleFileUpload(file, {
        onUploadStart: () => setIsUploading(true),
        onUploadEnd: () => setIsUploading(false),
        validateFile: validateImageFile,
      });

      if (result.success && result.url) {
        setValue("profilePicture", result.url);
      } else {
        alert(result.error || "Upload failed");
      }
    }
  };

  const handleAutofill = () => {
    const autofillData = SignUpDummy();
    (Object.keys(autofillData) as Array<keyof SignUpFormValues>).forEach(
      (key) => {
        const currentValue = getValues(key);
        if (!currentValue) {
          setValue(key, autofillData[key]);
        }
      }
    );
  };

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    console.log("Form submitted:", data);
    setSubmittedEmail(data.email);

    const result = await dispatch(signUpUser(data));

    if (signUpUser.fulfilled.match(result)) {
      console.log("result", result);
      setOpenOTPModal(true);
    } else {
      if (result.payload === signupMessages.EMAIL_EXISTS) {
        setErrorMessage("Email already in use");
        setOpenErrorToast(true);
      } else if (result.payload === signupMessages.WRONG_OTP) {
        setErrorMessage(signupMessages.WRONG_OTP);
      } else if (result.payload === signupMessages.OTP_EXPIRED) {
        setErrorMessage(signupMessages.OTP_EXPIRED);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  const handleOTPSubmit = async () => {
    try {
      const result = await dispatch(
        verifyOTP({
          email: submittedEmail,
          otp: otpValue,
        })
      );
      if (verifyOTP.fulfilled.match(result)) {
        navigate("/login");
      } else {
        if (result.payload === signupMessages.WRONG_OTP) {
          setErrorMessage(signupMessages.WRONG_OTP);
        } else if (result.payload === signupMessages.OTP_EXPIRED) {
          setErrorMessage(signupMessages.OTP_EXPIRED);
        } else {
          setErrorMessage("An error occurred during OTP verification");
        }

        setOpenErrorToast(true);
        setOpenOTPModal(false);
      }
    } catch (err) {
      console.log("SignupPage.tsx", err);
      setOpenErrorToast(true);
      setOpenOTPModal(false);
    } finally {
      setOtpValue("");
    }
  };

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
    <div className="signup-page">
      <div className="signup-form">
        <div className="form-container">
          <p className="title">Sign up</p>
          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <input
              {...register("username")}
              className={`input ${errors.username ? "error" : ""}`}
              placeholder="Name"
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p>
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
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}

            {/* Profile Picture */}
            <input
              type="file"
              {...register("profilePicture")}
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/jpeg,image/png,image/gif"
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
                {isUploading ? "Uploading..." : "Upload"}
              </div>
            </button>
            {errors.profilePicture && (
              <p className="error-message">{errors.profilePicture.message}</p>
            )}

            {/* Submit Button */}
            <button type="submit" className="form-btn" disabled={isUploading}>
              {isUploading || loading ? "Processing..." : "Sign up"}
            </button>
          </form>

          <p className="sign-up-label">
            Already have an account?
            <span className="sign-up-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

          <div className="buttons-container">
            <div className="google-login-button">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                version="1.1"
                x="0px"
                y="0px"
                className="google-icon"
                viewBox="0 0 48 48"
                height="1em"
                width="1em"
                xmlns={imageLinks.GOOGLE_SVG}
              >
                <path fill="#FFC107" d={imageLinks.GOOGLE_SIGN1} />
                <path fill="#FF3D00" d={imageLinks.GOOGLE_SIGN2} />
                <path fill="#4CAF50" d={imageLinks.GOOGLE_SIGN3} />
                <path fill="#1976D2" d={imageLinks.GOOGLE_SIGN4} />
              </svg>
              <span>Log in with Google</span>
            </div>

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
        <img src={imageLinks.ROCKET_SIGNUP} alt="Signup Illustration" />
      </div>

      {/* OTP Modal */}
      <Modal
        open={openOTPModal}
        onClose={() => setOpenOTPModal(false)}
        aria-labelledby="otp-modal-title"
        aria-describedby="otp-modal-description"
      >
        <Box sx={otpModalStyle}>
          <Typography id="otp-modal-title" variant="h6" component="h2">
            Enter OTP
          </Typography>
          <Typography id="otp-modal-description" sx={{ mt: 2 }}>
            Please check your email and enter the OTP sent to {submittedEmail}
          </Typography>
          <TextField
            fullWidth
            label="OTP"
            variant="outlined"
            margin="normal"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOTPSubmit}
            sx={{ mt: 2 }}
          >
            Verify OTP
          </Button>
        </Box>
      </Modal>

      {/* Error Snackbar */}
      <Snackbar
        open={openErrorToast}
        autoHideDuration={6000}
        onClose={handleCloseErrorToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseErrorToast}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage || error || "An error occurred. Please try again."}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignupPage;
