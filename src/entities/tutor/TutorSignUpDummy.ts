import { SignUpFormValues } from "../user/SignUpFormValues";
import { UserRole } from "../user/UserRole";

export const TutorSignUpDummy = (): SignUpFormValues => {
  return {
    name: "John Master",
    email: "johnmaster@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    role: UserRole.TUTOR,
  };
};
