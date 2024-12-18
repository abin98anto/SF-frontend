import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { SignUpFormValues } from "../../entities/SignUpFormValues";
import { signupMessages } from "../../utils/constants";

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
