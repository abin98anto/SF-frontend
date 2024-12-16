import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import userAuthReducer from "./features/userAuthSlice";
import tutorReducer from "./features/tutor/tutorSlice";
import tutorAuthReducer from "./features/tutor/tutorAuthSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    userLogin: userAuthReducer,
    tutor: tutorReducer,
    tutorLogin: tutorAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
