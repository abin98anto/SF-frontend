import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../../../entities/user/UserDetails";
import {
  loginTutor,
  logoutTutor,
  logoutUser,
} from "../../services/UserAuthServices";
import { someMessages } from "../../../utils/constants";
import { updateUser } from "../../services/userUpdateService";

export interface TutorState {
  loading: boolean;
  error: string;
  userInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: TutorState = {
  loading: false,
  error: "",
  userInfo: null,
  isAuthenticated: false,
};

const tutorSlice = createSlice({
  name: "tutor",
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
      // Tutor Login.
      .addCase(loginTutor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(loginTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      })

      // Tutor Update.
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update user";
      })

      // Tutor Logout.
      .addCase(logoutTutor.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutTutor.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.userInfo = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      });
  },
});

export const { resetLoginState, updateUserInfo } = tutorSlice.actions;
export default tutorSlice.reducer;
