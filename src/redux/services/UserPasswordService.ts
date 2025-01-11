import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { API_ENDPOINTS, someMessages } from "../../utils/constants";

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/forgot-password?email=${email}`
      );
      return response.data;
    } catch (error: any) {
      console.log(someMessages.FORGOT_PASS_THUNK_FAIL);
      return rejectWithValue(
        error.response?.data?.message || someMessages.FORGOT_PASS_FAIL
      );
    }
  }
);

export const setPassword = createAsyncThunk(
  "user/setPassword",
  async (
    { email, otp, password }: { email: string; otp: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.patch(API_ENDPOINTS.SET_PASS, {
        email,
        otp,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.log(someMessages.SET_PAS_THUNK_FAIL, error);
      return rejectWithValue(
        error.response?.data?.message || someMessages.SET_PASS_FAIL
      );
    }
  }
);
