import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import { imageLinks } from "../../../utils/constants";
import { SignUpDummy } from "../../../entities/SignUpDummy";
import { RootState } from "../../../redux/store";
import {
  loginUser,
  LoginFormValues,
} from "../../../redux/features/userAuthSlice";

const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state: RootState) => state.userLogin
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValues>();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (data: LoginFormValues) => {
    const newErrors: { email?: string; password?: string } = {};

    if (!data.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(data.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!data.password.trim()) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await dispatch(
          loginUser({
            email: data.email,
            password: data.password,
          })
        );

        if (loginUser.fulfilled.match(result)) {
          navigate("/"); // Adjust route as needed
        }
      } catch (err) {
        console.error("Login failed", err);
      }
    }
  };

  const handleAutofill = () => {
    const autofillData = SignUpDummy();

    if (!getValues("email")) {
      setValue("email", autofillData.email);
    }

    if (!getValues("password")) {
      setValue("password", autofillData.password);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <div className="form-container">
          <p className="title">Welcome back</p>

          {error && <p className="error-message">{error}</p>}

          <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("email", { required: "Email is required." })}
              className={`input ${errors.email ? "error" : ""}`}
              placeholder="Email"
              disabled={loading}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}

            <input
              {...register("password", { required: "Password is required." })}
              type="password"
              className={`input ${errors.password ? "error" : ""}`}
              placeholder="Password"
              disabled={loading}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}

            <p className="page-link">
              <span className="page-link-label">Forgot Password?</span>
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
    </div>
  );
};

export default LoginPage;
