import { TutorSignUpFormValues } from "./TutorSignUpFormValues";

export const TutorSignUpDummy = (): TutorSignUpFormValues => {
  return {
    name: "John Master",
    email: "johnmaster@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
    resume:
      "https://res.cloudinary.com/dqjjysikb/image/upload/v1733894416/casual-life-3d-boy-sitting-at-the-desk-with-open-book_9_q7m5yv.jpg",
  };
};
