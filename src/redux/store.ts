import {
  configureStore,
  combineReducers,
  // Reducer,
  // UnknownAction,
} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "./features/user/userSlice";
import tutorReducer from "./features/tutor/tutorSlice";
import adminAuthReducer from "./features/admin/adminAuthSlice";

// Define the root state type
// type RootState = {
//   user: UserState;
//   tutor: TutorState;
//   adminLogin: AdminState;
// };

// Define persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "tutor", "adminLogin"],
};

// Create root reducer without explicit typing on combineReducers
const rootReducer = combineReducers({
  user: userReducer,
  tutor: tutorReducer,
  adminLogin: adminAuthReducer,
});

// Type the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
        ],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
