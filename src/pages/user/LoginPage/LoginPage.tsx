import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { Snackbar, Alert } from "@mui/material";

import "./LoginPage.scss";
import { imageLinks, someMessages } from "../../../utils/constants";
import { RootState } from "../../../redux/store";
import { loginUser } from "../../../redux/services/UserAuthServices";
import { LoginFormValues } from "../../../entities/user/LoginFormValues";
import { StudentDummy } from "../../../entities/dummys/StudentDummy";
import { validateEmail } from "../../../utils/form-checks/validateEmail";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();
  const navigate = useNavigate();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { loading } = useSelector((state: RootState) => state.user);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

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
          showSnackSuccess("Login successful!");
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
            Don't have an account?<span className="sign-up-link">Sign up</span>
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
