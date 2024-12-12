import { imageLinks } from "../../../utils/constants";
import "./SignupPage.scss";

const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-form">
        <a className="signup-title">Sign Up</a>
        <div className="input-box1">
          <input type="text" required />
          <span className="user">Email</span>
        </div>
        <div className="input-box">
          <input type="text" required />
          <span>Username</span>
        </div>
        <div className="input-box">
          <input type="password" required />
          <span>Password</span>
        </div>
        <button className="signup-button">Enter</button>
      </div>
      <div className="signup-image">
        <img src={imageLinks.ROCKET_SIGNUP} alt="Signup Illustration" />
      </div>
    </div>
  );
};

export default SignupPage;
