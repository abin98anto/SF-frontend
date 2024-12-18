import { UserRole } from "./UserRole";

export interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive?: boolean;
  role?: UserRole;
}
