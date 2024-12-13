/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignUpFormValues } from "../../entities/SignUpFormValues";

interface UserState {
  userInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
};

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
      });
  },
});

export default userSlice.reducer;
