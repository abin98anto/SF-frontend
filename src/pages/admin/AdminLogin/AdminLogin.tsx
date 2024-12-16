import "./AdminLogin.scss";
import { imageLinks } from "../../../utils/constants";

import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store";
import { useForm } from "react-hook-form";
import {
  loginAdmin,
  AdminLoginFormValues,
} from "../../../redux/features/Admin/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import { AdminSignUpDummy } from "../../../entities/admin/AdminSignUpDummy";
import { useState } from "react";

const backgroundImage = imageLinks.BG_IMG;

const AdminLogin = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, any>>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.adminLogin);

  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<AdminLoginFormValues>();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (data: AdminLoginFormValues) => {
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
          loginAdmin({
            email: data.email,
            password: data.password,
          })
        );
        // console.log("the result in adminlogin", result);
        if (loginAdmin.fulfilled.match(result)) {
          navigate("/admin/dashboard");
        } else {
          setLoginError("Invalid email or password.");
        }
      } catch (err) {
        console.error("Login failed", err);
        setLoginError("An error occurred. Please try again.");
      }
    }
  };

  const handleAutofill = () => {
    const autofillData = AdminSignUpDummy();

    if (!getValues("email")) {
      setValue("email", autofillData.email);
    }

    if (!getValues("password")) {
      setValue("password", autofillData.password);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
    >
      <h1 className="heading">SkillForge</h1>
      <div className="login-overlay">
        <div className="login-form-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <input
                {...register("email", { required: "Email is required." })}
                className={`login-input ${errors.email ? "error" : ""}`}
                placeholder="Email"
                disabled={loading}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("password", { required: "Password is required." })}
                type="password"
                className={`login-input ${errors.password ? "error" : ""}`}
                placeholder="Password"
                disabled={loading}
              />
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Show login error message if credentials are invalid */}
          {loginError && <p className="error-message">{loginError}</p>}

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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
