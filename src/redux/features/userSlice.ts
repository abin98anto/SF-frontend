/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import axiosInstance from "../../utils/axiosConfig";

import { SignUpFormValues } from "../../entities/user/SignUpFormValues";
import { signupMessages } from "../../utils/constants";
import { signUpUser, verifyOTP } from "../services/UserSignupServices";
import { OTPVerificationResponse } from "../../entities/user/OTP";

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

// Async thunk to handle sign-up
// export const signUpUser = createAsyncThunk(
//   "user/sendOTP",
//   async (userData: SignUpFormValues, { rejectWithValue }) => {
//     try {
//       // const response = await axios.post(
//       //   "http://localhost:3000/send-otp",
//       //   userData
//       // );

//       const response = await axiosInstance.post("/send-otp", userData);

//       if (response.data.message === signupMessages.EMAIL_EXISTS) {
//         return rejectWithValue(signupMessages.EMAIL_EXISTS);
//       }
//       return response.data;
//     } catch (error: any) {
//       if (
//         axios.isAxiosError(error) &&
//         error.response?.data?.message === signupMessages.EMAIL_EXISTS
//       ) {
//         return rejectWithValue(signupMessages.EMAIL_EXISTS);
//       }

//       return rejectWithValue(
//         error.response?.data || signupMessages.UNKOWN_ERROR
//       );
//     }
//   }
// );

// export const verifyOTP = createAsyncThunk<
//   OTPVerificationResponse,
//   OTPVerificationPayload,
//   { rejectValue: string }
// >("user/verifyOTP", async (payload, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/verify-otp",
//       payload
//     );

//     if (response.data.success) {
//       return response.data;
//     } else {
//       if (response.data.message === "Invalid OTP") {
//         return thunkAPI.rejectWithValue(signupMessages.WRONG_OTP);
//       } else if (response.data.message === "OTP expired") {
//         return thunkAPI.rejectWithValue(signupMessages.OTP_EXPIRED);
//       } else {
//         return thunkAPI.rejectWithValue(signupMessages.OTP_VERIFICATION_FAIL);
//       }
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.error || error.message;
//       return thunkAPI.rejectWithValue(errorMessage);
//     }

//     return thunkAPI.rejectWithValue(signupMessages.UNKOWN_ERROR);
//   }
// });

// Async thunk to toggle user status
export const toggleUserStatus = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("user/toggleUserStatus", async (userId, { rejectWithValue }) => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/admin/toggle-status?id=${userId}`
    );
    return response.data.isActive;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle user status"
      );
    }
    return rejectWithValue("Failed to toggle user status");
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
        state.userInfo = action.meta.arg;
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
        state.error = action.payload || signupMessages.OTP_VERIFICATION_FAIL;
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
  },
});

export default userSlice.reducer;
