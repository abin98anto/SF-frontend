import { UserRole } from "./UserRole";

export interface SignUpFormValues {
  id?: string | undefined;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isActive?: boolean | undefined;
  role?: UserRole | undefined;
  resume?: string | undefined;
  profilePicture?: string | undefined;
}
