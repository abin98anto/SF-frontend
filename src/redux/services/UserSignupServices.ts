import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosConfig";
import { SignUpFormValues } from "../../entities/user/SignUpFormValues";
import { signupMessages } from "../../utils/constants";
import {
  OTPVerificationPayload,
  OTPVerificationResponse,
} from "../../entities/user/OTPValues";

// Async thunk to handle sign-up
export const signUpUser = createAsyncThunk(
  "user/sendOTP",
  async (userData: SignUpFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/send-otp", userData);

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
    const response = await axiosInstance.post("/verify-otp", payload);

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
