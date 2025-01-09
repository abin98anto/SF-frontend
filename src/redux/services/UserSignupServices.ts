import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosConfig";
import { SignUpFormValues } from "../../entities/user/SignUpFormValues";
import {
  OTPVerificationPayload,
  OTPVerificationResponse,
} from "../../entities/user/OTPValues";
import { API_ENDPOINTS, someMessages } from "../../utils/constants";

// Async thunk to handle sign-up
export const signUpUser = createAsyncThunk(
  "user/sendOTP",
  async (userData: SignUpFormValues, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.SEND_OTP,
        userData
      );

      if (response.data.message === someMessages.EMAIL_EXISTS) {
        return rejectWithValue(someMessages.EMAIL_EXISTS);
      }
      return response.data;
    } catch (error: any) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.message === someMessages.EMAIL_EXISTS
      ) {
        return rejectWithValue(someMessages.EMAIL_EXISTS);
      }

      return rejectWithValue(error.response?.data || someMessages.UNKOWN_ERROR);
    }
  }
);

export const verifyOTP = createAsyncThunk<
  OTPVerificationResponse,
  OTPVerificationPayload,
  { rejectValue: string }
>("user/verifyOTP", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VERIFY_OTP,
      payload
    );

    if (response.data.success) {
      return response.data;
    } else {
      if (response.data.message === someMessages.INVALID_OTP) {
        return thunkAPI.rejectWithValue(someMessages.WRONG_OTP);
      } else if (response.data.message === someMessages.OTP_EXPIRED) {
        return thunkAPI.rejectWithValue(someMessages.OTP_EXPIRED);
      } else {
        return thunkAPI.rejectWithValue(someMessages.OTP_VERIFICATION_FAIL);
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }

    return thunkAPI.rejectWithValue(someMessages.UNKOWN_ERROR);
  }
});
