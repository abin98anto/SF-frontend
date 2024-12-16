export interface SignUpFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePicture: string;
  isActive?: boolean;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
}

export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

export interface UserState {
  userInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null | undefined;
  isVerified?: boolean;
  user?: OTPVerificationResponse | null;
}
