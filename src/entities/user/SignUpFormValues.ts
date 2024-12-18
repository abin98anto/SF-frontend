import { UserRole } from "./UserRole";

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive?: boolean;
  role?: UserRole;
}

// export enum UserRole {
//   ADMIN = "admin",
//   USER = "user",
//   TUTOR = "tutor",
// }

// export interface OTPVerificationResponse {
//   success: boolean;
//   message: string;
// }

// export interface OTPVerificationPayload {
//   email: string;
//   otp: string;
// }
