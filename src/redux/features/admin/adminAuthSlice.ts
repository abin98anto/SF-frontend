import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../../../entities/user/UserDetails";
import { someMessages } from "../../../utils/constants";
import { loginAdmin, logoutAdmin } from "../../services/AdminAuthServices";
import { getUsers } from "../../services/UserManagementServices";

export interface AdminState {
  loading: boolean;
  error: string;
  adminInfo: UserDetails | null;
  userList: UserDetails[];
  tutorList: UserDetails[];
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  loading: false,
  error: "",
  adminInfo: null,
  userList: [],
  tutorList: [],
  isAuthenticated: false,
};

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
      })
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.isAuthenticated = false;
      })
      .addCase(
        getUsers.fulfilled,
        (state, action: PayloadAction<UserDetails[]>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.error = "";
          state.userList = action.payload;
        }
      )
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "User Fetch Failed!";
      });
  },
});

export const { resetLoginState, updateAdminInfo } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
