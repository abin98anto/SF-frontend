import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
import { OTPVerificationResponse } from "../../../entities/user/OTPValues";
import axiosInstance from "../../../utils/axiosConfig";
import { someMessages } from "../../../utils/constants";
import { signUpUser, verifyOTP } from "../../services/UserSignupServices";

export interface UserState {
  userInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null | undefined;
  isVerified?: boolean;
  user?: OTPVerificationResponse | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
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
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.user = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.OTP_VERIFICATION_FAIL;
        state.isVerified = false;
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userInfo) {
          state.userInfo.isActive = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // .addCase(updateUser.pending, (state) => {
    //   state.loading = true;
    //   state.error = "";
    // })
    // .addCase(updateUser.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.error = "";
    //   state.userInfo = state.userInfo
    //     ? { ...state.userInfo, ...action.payload }
    //     : action.payload;
    // })
    // .addCase(updateUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Failed to update user";
    // });
  },
});

export default userSlice.reducer;
