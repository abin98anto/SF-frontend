import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";

// import { LoginFormValues, UserDetails } from "../features/userAuthSlice";
// import { UserRole } from "../../entities/user/SignUpFormValues";
import { UserDetails } from "../../entities/user/UserDetails";
import { LoginFormValues } from "../../entities/user/LoginFormValues";
import { UserRole } from "../../entities/user/UserRole";

// User Login.
export const loginUser = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("user/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/login", credentials);

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

// User Logout.
export const logoutUser = createAsyncThunk<
  void,
  UserRole,
  { rejectValue: string }
>("user/logout", async (role, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/logout", { role });
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

// Tutor Login.
export const loginTutor = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("tutor/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/tutor/login", credentials);

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
