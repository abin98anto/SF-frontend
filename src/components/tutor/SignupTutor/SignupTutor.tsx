import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignUpFormValues } from "../../../entities/SignUpFormValues";
import { signUpSchema } from "../../../schemas/signUpSchema";
import FileUploadButton from "../../FileUploadButton/FileUploadButton";
import GoogleButton from "../../google-btn/GoogleButton";

interface SignupFormProps {
  onSubmit: SubmitHandler<SignUpFormValues>;
  isUploading: boolean;
  handleFileChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  handleAutofill: () => void;
  loading: boolean;
  navigateToLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  isUploading,
  handleFileChange,
  handleAutofill,
  loading,
  navigateToLogin,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
  });

  return (
    <div className="form-container">
      <p className="title">Tutor Sign up</p>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Username Input */}
        <input
          {...register("username")}
          className={`input ${errors.username ? "error" : ""}`}
          placeholder="Name"
        />
        {errors.username && (
          <p className="error-message">{errors.username.message}</p>
        )}

        {/* Email Input */}
        <input
          {...register("email")}
          type="email"
          className={`input ${errors.email ? "error" : ""}`}
          placeholder="Email"
        />
        {errors.email && (
          <p className="error-message">{errors.email.message}</p>
        )}

        {/* Password Input */}
        <input
          {...register("password")}
          type="password"
          className={`input ${errors.password ? "error" : ""}`}
          placeholder="Password"
        />
        {errors.password && (
          <p className="error-message">{errors.password.message}</p>
        )}

        {/* Confirm Password Input */}
        <input
          {...register("confirmPassword")}
          type="password"
          className={`input ${errors.confirmPassword ? "error" : ""}`}
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword.message}</p>
        )}

        {/* Profile Picture Upload */}
        <FileUploadButton
          handleFileChange={handleFileChange}
          isUploading={isUploading}
        />
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
        <span className="sign-up-link" onClick={navigateToLogin}>
          Login
        </span>
      </p>

      <GoogleButton />
      <div className="buttons-container">
        <button type="button" onClick={handleAutofill} className="autofill-btn">
          Autofill
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
