import { UserRole } from "./UserRole";

export interface SignUpFormValues {
  id?: string | undefined;
  name: string;
  email: string; // Make required
  password: string; // Make required
  confirmPassword: string; // Make required
  isActive?: boolean | undefined;
  role?: UserRole | undefined;
  resume?: string | undefined;
  profilePicture?: string | undefined;
}
