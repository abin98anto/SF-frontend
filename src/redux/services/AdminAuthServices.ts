import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { LoginFormValues } from "../../entities/user/LoginFormValues";
import axiosInstance from "../../utils/axiosConfig";
import axios from "axios";
import { someMessages } from "../../utils/constants";

// Admin Login.
export const loginAdmin = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("admin/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/admin/login", credentials);

    return {
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }

    return thunkAPI.rejectWithValue(someMessages.LOGIN_FAILED);
  }
});

// Admin Logout.
export const logoutAdmin = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("tutor/logout", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/admin/logout");

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }

    return thunkAPI.rejectWithValue(someMessages.LOGIN_FAILED);
  }
});
