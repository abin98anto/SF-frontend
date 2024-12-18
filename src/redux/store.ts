import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import userAuthReducer from "./features/userAuthSlice";
import tutorReducer from "./features/tutor/tutorSlice";
import tutorAuthReducer from "./features/tutor/tutorAuthSlice";
import adminAuthReducer from "./features/Admin/adminAuthSlice";
import userListReducer from "./features/userListSlice";
import tutorListReducer from "./features/tutor/tutorListSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    userLogin: userAuthReducer,
    userList: userListReducer,
    tutor: tutorReducer,
    tutorLogin: tutorAuthReducer,
    tutorList: tutorListReducer,
    adminLogin: adminAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
