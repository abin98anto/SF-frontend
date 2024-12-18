import { SignUpFormValues } from "../user/SignUpFormValues";
import { UserRole } from "../user/UserRole";

export const StudentDummy = (): SignUpFormValues => {
  return {
    name: "JohnDoe",
    email: "johndoe@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    role: UserRole.USER,
  };
};
