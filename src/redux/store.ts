import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./features/userSlice";
import userAuthReducer from "./features/userAuthSlice";
import tutorReducer from "./features/tutor/tutorSlice";
// import tutorAuthReducer from "./features/tutor/tutorAuthSlice";
import adminAuthReducer from "./features/admin/adminAuthSlice";
import userListReducer from "./features/userListSlice";
import tutorListReducer from "./features/tutor/tutorListSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "userLogin", "adminLogin"],
};

// Combine all reducers
const rootReducer = combineReducers({
  user: userReducer,
  userLogin: userAuthReducer,
  userList: userListReducer,
  tutor: tutorReducer,
  // tutorLogin: tutorAuthReducer,
  tutorList: tutorListReducer,
  adminLogin: adminAuthReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
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
