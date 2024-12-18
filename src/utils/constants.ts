export const imageLinks = {
  COMBINED_STUDY:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1733894417/group-study_p097zd.svg",
  STUDENTS_LIBARARY:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1733902789/students_hfajfe.svg",
  ROCKET_SIGNUP:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1733916298/signup-rocket_galfl8.png",
  D_CLOUD:
    "M 6.5,20 Q 4.22,20 2.61,18.43 1,16.85 1,14.58 1,12.63 2.17,11.1 3.35,9.57 5.25,9.15 5.88,6.85 7.75,5.43 9.63,4 12,4 14.93,4 16.96,6.04 19,8.07 19,11 q 1.73,0.2 2.86,1.5 1.14,1.28 1.14,3 0,1.88 -1.31,3.19 Q 20.38,20 18.5,20 Z",
  D_CHECK: "M 7.515,12.74 10.34143,15.563569 15.275,10.625",
  GOOGLE_SIGN1: `M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z`,
  GOOGLE_SIGN2: `M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z`,
  GOOGLE_SIGN3: `M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z`,
  GOOGLE_SIGN4: `M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z`,
  GOOGLE_SVG: "http://www.w3.org/2000/svg",
  LOGIN_IMG:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1733894418/beard-chair_c2pxa2.png",
  TUTOR_SIGNUP:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1734270190/tutor-login_j1w7hq.png",
  TUTOR_LOGIN:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1734270190/tutor-signup_xclymv.png",
  BG_IMG:
    "https://res.cloudinary.com/dqjjysikb/image/upload/v1734331882/AdminLogin-img_cav517.png",
};

export const cloudinaryLinks = {
  CLOUDI_UPLOAD: `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }/image/upload`,
};

export const someMessages = {
  EMAIL_EXISTS: "Email already in use",
  OTP_EXPIRED: "The OTP has expired. Please request a new one.",
  USER_VERFIED: "OTP verification successful. User is now active.",
  USER_NOT_FOUND: "User not found! Try signing up again.",
  WRONG_OTP: "The OTP you entered is incorrect.",
  UNKOWN_ERROR: "An error occurred. Please try again.",
  RESEND_OTP_FAIL: "Failed to resend OTP. Please try again.",
  OTP_VERIFICATION_FAIL: "OTP verification failed",
  OTP_SENT: `OTP send to the mail : `,
  LOGIN_FAILED: "Login failed",
  INVALID_CREDENTIALS: "Invalid email or password",
  TOKEN_REFRESH_FAILED: "Failed to refresh token",
  LOGOUT_FAILED: "Logout failed",
  NETWORK_ERROR: "Network error occurred",
  UNKNOWN_ERROR: "An unexpected error occurred",
  PASSWORD_WEAK: "Password is too weak",
  INVALID_EMAIL: "Invalid email format",
  SIGNUP_SUCCESS: "Tutor signup successful",
  EMAIL_REQUIRED: "Email required!",
  PASS_REQUIRED: "Password is required.",
  UPLOAD_SUCESS: "Upload successfull!",
  UPLOAD_FAIL: "Failed to upload resume",
};
