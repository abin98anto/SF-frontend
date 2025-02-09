import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Snackbar, Alert } from "@mui/material";

import "./LoginPage.scss";
import {
  API_ENDPOINTS,
  imageLinks,
  someMessages,
} from "../../../utils/constants";
import { AppRootState } from "../../../redux/store";
import {
  googleSignIn,
  loginUser,
} from "../../../redux/services/UserAuthServices";
import { LoginFormValues } from "../../../entities/user/LoginFormValues";
import { StudentDummy } from "../../../entities/dummys/StudentDummy";
import { validateEmail } from "../../../utils/form-checks/validateEmail";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { jwtDecode } from "jwt-decode";
import { UserRole } from "../../../entities/user/UserRole";
import GoogleButton from "../../../components/buttons/google-btn/GoogleButton";

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state: AppRootState) => state.user);
  const dispatch = useDispatch<ThunkDispatch<AppRootState, any, any>>();
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { loading } = useSelector((state: AppRootState) => state.user);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    const initializeGoogleSignIn = () => {
      // @ts-ignore (if using TypeScript)
      if (window.google) {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        // @ts-ignore
        google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large" }
        );
      }
    };

    initializeGoogleSignIn();
  }, [isAuthenticated, navigate]);

  const handleGoogleSignIn = async (response: any) => {
    try {
      if (!response.credential) {
        showSnackError("No credential received from Google");
        return;
      }

      const decoded: any = jwtDecode(response.credential);

      const user = {
        name: decoded.given_name,
        email: decoded.email,
        profilePicture: decoded.picture,
        role: UserRole.USER,
      };

      const result = await dispatch(googleSignIn(user)).unwrap();

      if (result && result.user) {
        navigate("/");
      }
    } catch (error) {
      console.error(someMessages.GOOGLE_SIGNIN_FAILED, error);
      showSnackError(someMessages.GOOGLE_SIGNIN_FAILED);
    }
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    if (!data.email.trim()) {
      showSnackError(someMessages.EMAIL_REQUIRED);
      return;
    }

    if (!validateEmail(data.email)) {
      showSnackError(someMessages.INVALID_EMAIL);
      return;
    }

    if (!data.password.trim()) {
      showSnackError(someMessages.PASS_REQUIRED);
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
        })
      );

      if (loginUser.fulfilled.match(result)) {
        const user = result.payload.user;
        if (user.role === "user") {
          navigate("/");
        } else {
          showSnackError(someMessages.USER_ONLY);
        }
      } else {
        showSnackError(result.payload || someMessages.LOGIN_FAILED);
      }
    } catch (err) {
      console.error(someMessages.LOGIN_FAILED, err);
      showSnackError(someMessages.UNKNOWN_ERROR);
    }
  };

  const handleAutofill = () => {
    const autofillData = StudentDummy();

    if (!getValues("email")) {
      setValue("email", autofillData.email);
    }

    if (!getValues("password")) {
      setValue("password", autofillData.password);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <div className="form-container">
          <p className="title">Welcome back</p>

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email")}
              className={`input ${errors.email ? "error" : ""}`}
              placeholder="Email"
              disabled={loading}
            />

            <input
              {...register("password")}
              type="password"
              className={`input ${errors.password ? "error" : ""}`}
              placeholder="Password"
              disabled={loading}
            />

            <p className="page-link">
              <span
                className="page-link-label"
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </span>
            </p>
            <button className="form-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <div id="google-signin-button">
            <GoogleButton />
          </div>
          <div className="buttons-container">
            <button
              type="button"
              onClick={handleAutofill}
              className="autofill-btn"
              disabled={loading}
            >
              Autofill
            </button>
          </div>
          <p className="sign-up-label">
            Don't have an account?
            <span
              className="sign-up-link"
              onClick={() => navigate(API_ENDPOINTS.USER_SIGNUP)}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
      <div className="login-image">
        <img src={imageLinks.LOGIN_IMG} alt="Login Illustration" />
      </div>
      <ForgotPasswordModal
        show={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
      />
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

export default LoginPage;
