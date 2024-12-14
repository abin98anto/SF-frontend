import { imageLinks } from "../../utils/constants";

const GoogleButton = () => {
  return (
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
  );
};

export default GoogleButton;
