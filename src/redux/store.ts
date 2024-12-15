import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import userAuthReducer from "./features/userAuthSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    userLogin: userAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
