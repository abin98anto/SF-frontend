import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface adminDetails {
  id?: string;
  email?: string;
  name?: string;
  profilePicture?: string;
}

export interface AdminLoginFormValues {
  email: string;
  password: string;
}

export interface AdminState {
  loading: boolean;
  error: string;
  adminInfo: adminDetails | null;
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
  { message: string; user: adminDetails }, // Return type
  AdminLoginFormValues, // First argument type
  { rejectValue: string } // ThunkAPI config type
>("admin/login", async (credentials, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/admin/login",
      credentials,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("respoonse", response);

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

export const logoutAdmin = createAsyncThunk<
  void, // Return type
  void, // First argument type (none in this case)
  { rejectValue: string } // ThunkAPI config type
>("tutor/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/admin/logout",
      {},
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

const adminLoginSlice = createSlice({
  name: "adminLogin",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
    updateAdminInfo: (state, action: PayloadAction<Partial<adminDetails>>) => {
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
        state.error = action.payload || "Login failed";
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
