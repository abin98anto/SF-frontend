import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// import { LoginFormValues, UserDetails } from "../features/userAuthSlice";
import { UserRole } from "../../entities/SignUpFormValues";
import { UserDetails } from "../../entities/UserDetails";
import { LoginFormValues } from "../../entities/LoginFormValues";

// Correct type definition for createAsyncThunk
export const loginUser = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("user/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/login",
      credentials,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return {
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Login failed"
      );
    }

    return thunkAPI.rejectWithValue("Login failed");
  }
});

export const logoutUser = createAsyncThunk<
  void,
  UserRole,
  { rejectValue: string }
>("user/logout", async (role, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/logout",
      { role },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Logout failed"
      );
    }
    return thunkAPI.rejectWithValue("Logout failed");
  }
});
