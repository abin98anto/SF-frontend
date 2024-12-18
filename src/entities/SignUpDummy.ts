import { SignUpFormValues, UserRole } from "./SignUpFormValues";

export const SignUpDummy = (): SignUpFormValues => {
  return {
    name: "JohnDoe",
    email: "johndoe@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    role: UserRole.USER,
  };
};
