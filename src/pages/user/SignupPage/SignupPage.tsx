import "./SignupPage.scss";
import { signUpSchema } from "../../../schemas/signUpSchema";
import { imageLinks } from "../../../utils/constants";
import { uploadToCloudinary } from "../../../utils/cloudinary";
import { SignUpFormValues } from "../../../entities/SignUpFormValues";

import React, { useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const SignupPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
  });

  const [fileName, setFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
          // Start upload process
          try {
            setIsUploading(true);
            const cloudinaryUrl = await uploadToCloudinary(file);
            setValue("profilePicture", cloudinaryUrl);
            setFileName(file.name);
          } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
          } finally {
            setIsUploading(false);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    console.log("Form submitted:", data);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

            {/* email */}
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
                {isUploading ? "Uploading..." : fileName ? fileName : "Upload"}
              </div>
            </button>
            {errors.profilePicture && (
              <p className="error-message">{errors.profilePicture.message}</p>
            )}

            <button type="submit" className="form-btn" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Sign up"}
            </button>
          </form>

          <p className="sign-up-label">
            Already have an account?
            <span className="sign-up-link">Login</span>
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
          </div>
        </div>
      </div>
      <div className="signup-image">
        <img src={imageLinks.ROCKET_SIGNUP} alt="Signup Illustration" />
      </div>
    </div>
  );
};

export default SignupPage;
