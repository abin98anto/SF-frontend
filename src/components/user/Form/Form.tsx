import React from "react";
import "./Form.scss";

const SignupForm: React.FC = () => {
  return (
    <div className="signup-form">
      <div className="form-fields">
        <div className="form-field">
          <input type="text" id="name" placeholder="Enter your Name" />
        </div>
        <div className="form-field">
          <input type="email" id="email" placeholder="Enter your Email" />
        </div>
        <div className="form-field">
          <input
            type="password"
            id="password"
            placeholder="Enter your Password"
          />
        </div>
      </div>
      <button type="submit" className="signup-button">
        Sign Up
      </button>
      <div className="login-link">
        <span>Already have a account?</span>
        <a href="#">login</a>
      </div>
      <div className="google-signup">
        <img src="http://www.w3.org/2000/svg" alt="Google Logo" />
        <span>Google</span>
      </div>
    </div>
  );
};

export default SignupForm;
