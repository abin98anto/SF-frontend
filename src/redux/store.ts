import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import userAuthReducer from "./features/userAuthSlice";
import tutorReducer from "./features/tutor/tutorSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    userLogin: userAuthReducer,
    tutor: tutorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
