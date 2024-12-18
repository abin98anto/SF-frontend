import { UserRole } from "./UserRole";

export interface SignUpFormValues {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive?: boolean;
  role?: UserRole;
  resume?: string;
  profilePicture?: string;
}
