/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  userDetails: Record<string, any> | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userDetails: null,
  loading: false,
  error: null,
};

// Async thunk to handle sign-up
export const signUpUser = createAsyncThunk(
  "/signUp",
  async (userData: Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/send-otp",
        userData
      );
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
        state.userDetails = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
