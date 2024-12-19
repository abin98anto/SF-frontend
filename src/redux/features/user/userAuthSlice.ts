import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loginTutor,
  loginUser,
  logoutUser,
} from "../../services/UserAuthServices";
import { UserDetails } from "../../../entities/user/UserDetails";
import { someMessages } from "../../../utils/constants";
import { updateUser } from "../../services/userUpdateService";

export interface UserState {
  loading: boolean;
  error: string;
  userInfo: UserDetails | null;
  tutorInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  loading: false,
  error: "",
  userInfo: null,
  tutorInfo: null,
  isAuthenticated: false,
};

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.userInfo = state.userInfo
        ? { ...state.userInfo, ...action.payload }
        : null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      })

      // Tutor Login
      .addCase(loginTutor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.tutorInfo = action.payload.user;
      })
      .addCase(loginTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      })

      // User Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.userInfo = null;
        state.isAuthenticated = !!state.tutorInfo;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGOUT_FAILED;
      })

      .addCase("tutor/logout", (state) => {
        state.tutorInfo = null;
        state.isAuthenticated = !!state.userInfo;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.tutorInfo = state.tutorInfo
          ? { ...state.tutorInfo, ...action.payload }
          : action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update tutor";
      });
  },
});

export const { resetLoginState, updateUserInfo } = userLoginSlice.actions;
export default userLoginSlice.reducer;
