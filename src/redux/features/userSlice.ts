/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import {
  OTPVerificationPayload,
  OTPVerificationResponse,
  SignUpFormValues,
  UserState,
} from "../../entities/SignUpFormValues";
import { signupMessages } from "../../utils/constants";

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
};

// Async thunk to handle sign-up
export const signUpUser = createAsyncThunk(
  "user/sendOTP",
  async (userData: SignUpFormValues, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/send-otp",
        userData
      );

      if (response.data.message === signupMessages.EMAIL_EXISTS) {
        return rejectWithValue(signupMessages.EMAIL_EXISTS);
      }
      return response.data;
    } catch (error: any) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message === signupMessages.EMAIL_EXISTS
      ) {
        return rejectWithValue(signupMessages.EMAIL_EXISTS);
      }

      return rejectWithValue(
        error.response?.data || signupMessages.UNKOWN_ERROR
      );
    }
  }
);

export const verifyOTP = createAsyncThunk<
  OTPVerificationResponse,
  OTPVerificationPayload,
  { rejectValue: string }
>("user/verifyOTP", async (payload, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/verify-otp",
      payload
    );

    if (response.data.success) {
      return response.data;
    } else {
      if (response.data.message === "Invalid OTP") {
        return thunkAPI.rejectWithValue(signupMessages.WRONG_OTP);
      } else if (response.data.message === "OTP expired") {
        return thunkAPI.rejectWithValue(signupMessages.OTP_EXPIRED);
      } else {
        return thunkAPI.rejectWithValue(signupMessages.OTP_VERIFICATION_FAIL);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }

    return thunkAPI.rejectWithValue(signupMessages.UNKOWN_ERROR);
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
      });
  },
});

export default userSlice.reducer;
