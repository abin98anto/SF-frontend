export interface TutorSignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  resume: string;
}

export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
}

export interface TutorState {
  tutorInfo: TutorSignUpFormValues | null;
  loading: boolean;
  error: string | null;
  isVerified?: boolean;
  tutor?: OTPVerificationResponse | null;
}
