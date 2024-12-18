export interface OTPVerificationPayload {
  email: string;
  otp: string;
}

export interface OTPVerificationResponse {
  success: boolean;
  message: string;
}