import { createSlice } from "@reduxjs/toolkit";
import { someMessages } from "../../../utils/constants";
import { signUpUser, verifyOTP } from "../../services/UserSignupServices";
import {
  googleSignIn,
  loginUser,
  logoutUser,
} from "../../services/UserAuthServices";
import { UserDetails } from "../../../entities/user/UserDetails";
import { updateStudent } from "../../services/userUpdateService";
import {
  forgotPassword,
  setPassword,
} from "../../services/UserPasswordService";

export interface UserState {
  loading: boolean;
  error: string | { message: string } | null;
  userInfo: UserDetails | null;
  isAuthenticated?: boolean;
}

const initialState: UserState = {
  loading: false,
  error: "",
  userInfo: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // User/Tutor Send OTP.
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // User/Tutor Verify OTP.
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.OTP_VERIFICATION_FAIL;
        state.isAuthenticated = false;
      })

      // User Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      })

      // User Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.userInfo = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGOUT_FAILED;
      })

      // Update User Case
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = {
          ...state.userInfo,
          ...action.payload,
        };
        state.error = "";
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.USER_UPDATE_FAIL;
      })

      // Google Auth
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || someMessages.GOOGLE_SIGNIN_FAILED;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Set New Password
      .addCase(setPassword.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(setPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(setPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
