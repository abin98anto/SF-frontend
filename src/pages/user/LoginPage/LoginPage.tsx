import "./LoginPage.scss";
import { imageLinks } from "../../../utils/constants";
import GoogleButton from "../../../components/google-btn/GoogleButton";

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-form">
        <div className="form-container">
          <p className="title">Welcome back</p>
          <form className="form">
            <input type="email" className="input" placeholder="Email" />
            <input type="password" className="input" placeholder="Password" />
            <p className="page-link">
              <span className="page-link-label">Forgot Password?</span>
            </p>
            <button className="form-btn">Log in</button>
          </form>
          <p className="sign-up-label">
            Don't have an account?<span className="sign-up-link">Sign up</span>
          </p>
          <GoogleButton />
        </div>
      </div>
      <div className="login-image">
        <img src={imageLinks.LOGIN_IMG} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default LoginPage;
