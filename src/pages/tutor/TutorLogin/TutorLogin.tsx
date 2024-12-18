import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";

import "./TutorLogin.scss";
import { imageLinks } from "../../../utils/constants";
import { TutorSignUpDummy } from "../../../entities/tutor/TutorSignUpDummy";
import { RootState } from "../../../redux/store";
import { loginTutor } from "../../../redux/services/UserAuthServices";
import { LoginFormValues } from "../../../entities/user/LoginFormValues";

const TutorLogin = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();
  const navigate = useNavigate();
  const [customError, setCustomError] = useState<string | null>(null);

  const { loading, error } = useSelector((state: RootState) => state.userLogin);

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
    setCustomError(null);

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
          loginTutor({
            email: data.email,
            password: data.password,
          })
        );

        // console.log("after login, ", result);

        if (loginTutor.fulfilled.match(result)) {
          const user = result.payload.user;
          if (user.role === "tutor") {
            navigate("/tutor/dashboard");
          } else {
            setCustomError("Only tutors are allowed to log in.");
          }
        } else {
          setCustomError(result.payload || "Login failed");
        }
      } catch (err) {
        console.error("Login failed", err);
        setCustomError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleAutofill = () => {
    const autofillData = TutorSignUpDummy();

    if (!getValues("email")) {
      setValue("email", autofillData.email);
    }

    if (!getValues("password")) {
      setValue("password", autofillData.password);
    }
  };

  return (
    <>
      <div className="heading">SkillForge</div>
      <div className="login-page">
        <div className="login-form">
          <div className="form-container">
            <p className="title">Tutor Login</p>

            {/* Display custom error if exists */}
            {customError && <p className="error-message">{customError}</p>}

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
              Don't have an account?
              <span
                className="sign-up-link"
                onClick={() => navigate("/tutor/signup")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
        <div className="login-image">
          <img src={imageLinks.TUTOR_LOGIN} alt="Login Illustration" />
        </div>
      </div>
    </>
  );
};

export default TutorLogin;
