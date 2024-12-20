import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
import { OTPVerificationResponse } from "../../../entities/user/OTPValues";
import axiosInstance from "../../../utils/axiosConfig";
import { someMessages } from "../../../utils/constants";
import { signUpUser, verifyOTP } from "../../services/UserSignupServices";
import { loginUser, logoutUser } from "../../services/UserAuthServices";
import { UserDetails } from "../../../entities/user/UserDetails";

export interface UserState {
  loading: boolean;
  error: string;
  userInfo: UserDetails | null;
  isAuthenticated?: boolean;
}

const initialState: UserState = {
  loading: false,
  error: "",
  userInfo: null,
  isAuthenticated: false,
};

// Async thunk to toggle user status
export const toggleUserStatus = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("user/toggleUserStatus", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/toggle-status?id=${userId}`
    );
    return response.data.isActive;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.TOGGLE_FAIL
      );
    }
    return rejectWithValue(someMessages.TOGGLE_FAIL);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // User/Tutor Send OTP.
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // User/Tutor Verify OTP.
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userInfo = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.OTP_VERIFICATION_FAIL;
        state.isAuthenticated = false;
      })

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

      // User Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.userInfo = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGOUT_FAILED;
      })

      // Toggle User Status.
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userInfo) {
          state.userInfo.isActive = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error toggling user status.";
      });
  },
});

export default userSlice.reducer;
