import { SignUpFormValues, UserRole } from "./SignUpFormValues";

export const SignUpDummy = (): SignUpFormValues => {
  return {
    username: "JohnDoe",
    email: "johndoe@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    profilePicture:
      "https://res.cloudinary.com/dqjjysikb/image/upload/v1733894416/casual-life-3d-boy-sitting-at-the-desk-with-open-book_9_q7m5yv.jpg",
    role: UserRole.USER,
  };
};
