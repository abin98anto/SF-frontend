import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";
import { someMessages } from "../../utils/constants";

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/forgot-password?email=${email}`
      );
      return response.data;
    } catch (error: any) {
      //   console.log("the error", error);
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
      const response = await axiosInstance.patch("/set-password", {
        email,
        otp,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.log("the error", error);
      return rejectWithValue(
        error.response?.data?.message || someMessages.SET_PASS_FAIL
      );
    }
  }
);
