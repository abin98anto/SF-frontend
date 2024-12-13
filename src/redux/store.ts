import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice"; // Replace with your actual reducer

const store = configureStore({
  reducer: {
    user: userReducer, // Add other reducers as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
