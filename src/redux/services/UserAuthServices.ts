import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";
import { UserDetails } from "../../entities/user/UserDetails";
import { LoginFormValues } from "../../entities/user/LoginFormValues";
import { UserRole } from "../../entities/user/UserRole";
import { API_ENDPOINTS, someMessages } from "../../utils/constants";

// User Login.
export const loginUser = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("user/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.USER_LOGIN,
      credentials
    );

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

// User Logout.
export const logoutUser = createAsyncThunk<
  void,
  UserRole,
  { rejectValue: string }
>("user/logout", async (role, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER_LOGOUT, {
      role,
    });
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

// Tutor Login.
export const loginTutor = createAsyncThunk<
  { message: string; user: UserDetails },
  LoginFormValues,
  { rejectValue: string }
>("tutor/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.TUTOR_LOGIN,
      credentials
    );

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

// User Logout.
export const logoutTutor = createAsyncThunk<
  void,
  UserRole,
  { rejectValue: string }
>("user/logout", async (role, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.TUTOR_LOGOUT, {
      role,
    });
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

// Google signup/login.
export const googleSignIn = createAsyncThunk(
  "user/googleSignIn",
  async (token: Partial<UserDetails>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.USER_GOOGLE_LOGIN,
        { token }
      );

      return {
        message: response.data.message,
        user: response.data.data,
      };
    } catch (error) {
      console.log(someMessages.GOOGLE_SIGNIN_FAILED, error);
      return rejectWithValue(someMessages.GOOGLE_SIGNIN_FAILED);
    }
  }
);
