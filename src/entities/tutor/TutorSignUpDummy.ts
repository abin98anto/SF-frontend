import { UserRole } from "../SignUpFormValues";
import { TutorSignUpFormValues } from "./TutorSignUpFormValues";

export const TutorSignUpDummy = (): TutorSignUpFormValues => {
  return {
    _id: "ddd",
    name: "John Master",
    email: "johnmaster@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    role: UserRole.TUTOR,
  };
};
