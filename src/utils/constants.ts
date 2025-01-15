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
  }/raw/upload`,
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
  OTP_SENT: `OTP send to the mail`,
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
  TUTOR_ONLY: "Only tutors are allowed to log in.",
  USER_ONLY: "Tutors and Admins are not allowed.",
  TOGGLE_FAIL: "Failed to toggle user status",
  GOOGLE_SIGNIN_FAILED: "Google Sign-In failed. Please try again.",
  ADD_CAT_FAIL: "Failed to add category. Please try again.",
  UPDATE_CAT_FAIL: "Failed to update category",
  FETCH_CAT_FAIL: "Error fetching categories",
  IMG_UPLOAD_FAIL: "Failed to upload image",
  THUMBNAIL_REQ: "Thumbnail is required",
  DESCRIPTION_RQ: "Description is required",
  TITLE_REQ: "Title is required",
  SUBTITLE_REQ: "Subtitle is required",
  CAT_REQ: "Category is required",
  TOPIC_REQ: "Topic is required",
  LANG_REQ: "Language is required",
  DURA_REQ: "Duration is required",
  UPLOADING: "Uploading...",
  IMG_UPLOAD_SUCCESS: "Image uploaded successfully",
  THUMBNAIL_DEFAULT: "Upload your course thumbnail",
  LESSON_REQ: "Lesson name is required",
  UPLOAD: "Upload",
  DESCRIPTION_PLACEHOLDER: "Provide a detailed description.",
  NO_CAT_RECIVIED: "No categories data received",
  LOADING: "Loading...",
  TOPIC_PLACEHOLDER: "What is primarily taught in your course?",
  DURA_PLACEHOLDER: "Course duration",
  INVALID_VIDEO:
    "Invalid video file. Please upload a valid MP4, WebM, or OGG video file (max 100MB).",
  VIDEO_UPLOAD_FAIL: "Failed to upload video",
  SECTION_REQ: "At least one section is required",
  LESSON_REQ2: "Each section must have at least one lecture",
  COURSE_PUB_SUCC: "Course published successfully:",
  COURSE_PUB_FAIL: "Failed to publish course. Please try again.",
  ADD_LESSSON: "Create Lesson",
  VIDEO_UPLOAD: "Upload New Video",
  VIDEO_CHANGE: "Change Video",
  LESSON_UPDATE: "Update Lesson",
  PUBLISHING: "Publishing...",
  COURSE_PUB: "Publish Course",
  COURSE_UNLIST: "Are you sure you want to discard this course?",
  NO_COURSE_ID: "No course ID provided. Please go back and try again.",
  INVALID_COURSE: "Invalid course data structure",
  COURSE_FETCH_FAIL: "Failed to fetch course data. Please try again.",
  COURSE_UPDATE_FAIL: "Failed to update course. Please try again.",
  SUBS_DETAILS_FETCH_FAIL: "Failed to load subscription details",
  NAME_REQ: "Name is required",
  ADD_FEATURE: "At least one feature is required",
  PRICE_ERR: "Monthly price must be greater than 0",
  DISCOUNT_ERR: "Discount must be above 0 and less than monthly price",
  DISCOUNT_DATE_ERR: "Please specify discount validity period",
  SUBS_UPDATE_SUCC: "Subscription updated successfully",
  SUBS_FETCH_FAIL: "Failed to fetch subscriptions:",
  SUBS_DEL_FAIL: "Failed to delete subscription:",
  UNV_TUTORS_FETCH_FAIL: "Error fetching unverified tutors",
  APPROVE_TUTOR_FAIL: "Error approving tutor:",
  DENY_TUTOR_FAIL: "Error denying tutor:",
  TUTORS_FETCH_FAIL: "Error fetching tutors",
  TUTOR_TOOGLE_FAIL: "Failed to toggle tutor state",
  USERS_FETCH_FAIL: "Error fetching users. Please try again later.",
  USER_TOOGLE_FAIL: "Failed to toggle user state",
  RESUME_UPLOAD_FAIL: "Failed to upload resume",
  RESUME_DEL_FAIL: "Failed to delete resume",
  PROFILE_UPDATE_FAIL: "Failed to update profile",
  COURSE_DETAILS_FETCH_FAIL: "Failed to fetch course details",
  ORDER_ADD_FAIL: "Error recording order. Please contact support.",
  PAYMENT_ERROR: "error fetching submit payment",
  USER_UPDATE_FAIL: "Failed to update user details",
  INVALID_OTP: "The OTP you entered is incorrect.",
  TUTOR_UPDATE_FAIL: "Failed to update tutor",
  FILE_UPLOAD_FAIL: "Failed to upload file",
  FILE_UPLOAD_SUCC: "File uploaded successfully!",
  FORGOT_PASS_OTP_FAIL: "Sending OTP for forgot password failed!",
  FORGOT_PASS_FAIL: "Fogot password failed!",
  PASSWORD_MISMATCH: "Passwords must be same!",
  SET_PASS_FAIL: "Setting new password failed!",
  EMAIL_NOT_FOUND: "No accounts associated with the email!",
  PASS_CHANGE_SUCC: "Password has successfully changed!",
  OTP_REQ: "Please enter the OTP",
  CONFIRM_PASS_REQ: "Please confirm your password",
  FORGOT_PASS_THUNK_FAIL: "Forgot password thunk failed.",
  SET_PAS_THUNK_FAIL: "Set password thunik failed.",
  GOOGLE_NO_CRED: "No credential received from Google",
};

export const API_ENDPOINTS = {
  ADD_CAT: "/admin/add-category",
  UPDATE_CAT: `/admin/update-category`,
  GET_CATS: "/admin/categories",
  ADD_COURSE: "/admin/add-course",
  COURSE_M: "/admin/course-management",
  COURSE_UPDATE: `/admin/change-status`,
  SUBS_ADD: "/admin/create-subscription",
  SUBS: "/admin/subscriptions",
  TUTOR_DASH: "/tutor/dashboard",
  GET_COURSES: "/courses",
  RAZORPAY_CHECKOUT: "https://checkout.razorpay.com/v1/checkout.js",
  RAZORPAY_ADD: "/order/razorpay/create",
  ORDER_ADD: "/order/create-order",
  ADMIN_LOGIN: "/admin/login",
  ADMIN_LOGOUT: "/admin/logout",
  USER_GOOGLE_LOGIN: `/auth/google`,
  USER_LOGOUT: "/logout",
  TUTOR_LOGIN: "/tutor/login",
  TUTOR_LOGOUT: "/tutor/logout",
  USER_LOGIN: "/login",
  SEND_OTP: "/send-otp",
  VERIFY_OTP: "/verify-otp",
  SET_PASS: "/set-password",
  USER_DASH: "/",
  USER_SIGNUP: "/signup",
};
