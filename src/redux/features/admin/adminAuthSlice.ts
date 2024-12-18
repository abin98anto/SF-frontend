import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { LoginFormValues } from "../../../entities/user/LoginFormValues";
import { UserDetails } from "../../../entities/user/UserDetails";
import axiosInstance from "../../../utils/axiosConfig";
import { someMessages } from "../../../utils/constants";

export interface AdminState {
  loading: boolean;
  error: string;
  adminInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  loading: false,
  error: "",
  adminInfo: null,
  isAuthenticated: false,
};

// Correct type definition for createAsyncThunk
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

const adminLoginSlice = createSlice({
  name: "adminLogin",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
    updateAdminInfo: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.adminInfo = state.adminInfo
        ? { ...state.adminInfo, ...action.payload }
        : null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.isAuthenticated = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.adminInfo = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
        state.isAuthenticated = false;
        state.adminInfo = null;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.adminInfo = null;
        state.error = "";
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { resetLoginState, updateAdminInfo } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
