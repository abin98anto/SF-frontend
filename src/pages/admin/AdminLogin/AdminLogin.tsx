import "./AdminLogin.scss";
import { imageLinks, someMessages } from "../../../utils/constants";

import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../redux/store";
import { useForm } from "react-hook-form";
import { loginAdmin } from "../../../redux/services/AdminAuthServices";
import { useNavigate } from "react-router-dom";
import { AdminDummy } from "../../../entities/dummys/AdminDummy";
import { useEffect, useState } from "react";
import { LoginFormValues } from "../../../entities/user/LoginFormValues";
import { validateEmail } from "../../../utils/form-checks/validateEmail";

const backgroundImage = imageLinks.BG_IMG;

const AdminLogin = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.adminLogin
  );

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
  } = useForm<LoginFormValues>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    const newErrors: { email?: string; password?: string } = {};

    if (!data.email.trim()) {
      newErrors.email = someMessages.EMAIL_REQUIRED;
    } else if (!validateEmail(data.email)) {
      newErrors.email = someMessages.INVALID_EMAIL;
    }

    if (!data.password.trim()) {
      newErrors.password = someMessages.PASS_REQUIRED;
    }

    if (Object.keys(newErrors).length === 0) {
      try {
        const result = await dispatch(
          loginAdmin({
            email: data.email,
            password: data.password,
          })
        );
        if (loginAdmin.fulfilled.match(result)) {
          navigate("/admin/dashboard");
        } else {
          setLoginError(someMessages.INVALID_CREDENTIALS);
        }
      } catch (err) {
        console.error(someMessages.LOGIN_FAILED, err);
        setLoginError(someMessages.UNKOWN_ERROR);
      }
    }
  };

  const handleAutofill = () => {
    const autofillData = AdminDummy();
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
      <div className="login-overlay">
        <h1 className="admin-login-heading">SkillForge</h1>
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

            <div className="autofill" onClick={handleAutofill}>
              a
            </div>
          </form>

          {loginError && <p className="error-message">{loginError}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
