import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./features/user/userSlice";
import userAuthReducer from "./features/user/userAuthSlice";
// import tutorReducer from "./features/tutor/tutorSlice";
import adminAuthReducer from "./features/admin/adminAuthSlice";
// import userListReducer from "./features/user/userListSlice";
// import tutorListReducer from "./features/tutor/tutorListSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "userLogin", "adminLogin"],
};

const rootReducer = combineReducers({
  user: userReducer,
  userLogin: userAuthReducer,
  // userList: userListReducer,
  // tutor: tutorReducer,
  // tutorList: tutorListReducer,
  adminLogin: adminAuthReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
