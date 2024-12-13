import { imageLinks } from "../../../utils/constants";
import "./SignupPage.scss";

import React, { useRef, useState } from "react";

const SignupPage = () => {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="signup-page">
      <div className="signup-form">
        <div className="form-container">
          <p className="title">Sign up</p>
          <form className="form">
            <input className="input" placeholder="Name" />
            <input type="email" className="input" placeholder="Email" />
            <input type="password" className="input" placeholder="Password" />
            <input
              type="password"
              className="input"
              placeholder="Confirm Password"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button className="button" onClick={triggerFileInput} type="button">
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
              <div className="txt-upload">{fileName ? fileName : "Upload"}</div>
            </button>
            <button className="form-btn">Sign up</button>
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
