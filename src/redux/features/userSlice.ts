/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignUpFormValues } from "../../entities/SignUpFormValues";

interface UserState {
  userInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null;
  isVerified?: boolean;
  user?: OTPVerificationResponse | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
};

interface OTPVerificationPayload {
  email: string;
  otp: string;
}

// Define the type for the API response
interface OTPVerificationResponse {
  success: boolean;
  message: string;
}

// Async thunk to handle sign-up
export const signUpUser = createAsyncThunk(
  "/signUp",
  async (userData: SignUpFormValues, { rejectWithValue }) => {
    try {
      console.log("first");
      const response = await axios.post(
        "http://localhost:3000/send-otp",
        userData
      );
      console.log("second", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const verifyOTP = createAsyncThunk<
  OTPVerificationResponse,
  OTPVerificationPayload,
  { rejectValue: string }
>("user/verifyOTP", async (payload, thunkAPI) => {
  try {
    const response = await axios.post<OTPVerificationResponse>(
      "http://localhost:3000/verify-otp",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      // OTP verified successfully
      return response.data;
    } else {
      // OTP verification failed
      return thunkAPI.rejectWithValue(
        response.data.message || "OTP verification failed"
      );
    }
  } catch (error) {
    // Handle network errors or other exceptions
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred during OTP verification";

      return thunkAPI.rejectWithValue(errorMessage);
    }

    return thunkAPI.rejectWithValue("An unexpected error occurred");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
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
        state.user = action.payload; // Assuming you want to store user info
        // You might want to navigate to login or dashboard here
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OTP verification failed";
        state.isVerified = false;
      });
  },
});

export default userSlice.reducer;
