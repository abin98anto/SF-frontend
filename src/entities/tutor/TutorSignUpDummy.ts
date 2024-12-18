import { SignUpFormValues, UserRole } from "../SignUpFormValues";
import { TutorSignUpFormValues } from "./TutorSignUpFormValues";

export const TutorSignUpDummy = (): SignUpFormValues => {
  return {
    name: "John Master",
    email: "johnmaster@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    role: UserRole.TUTOR,
  };
};
