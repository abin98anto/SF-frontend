/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
import { OTPVerificationResponse } from "../../../entities/user/OTPValues";
import axiosInstance from "../../../utils/axiosConfig";
import { someMessages } from "../../../utils/constants";
import { signUpUser, verifyOTP } from "../../services/UserSignupServices";
// import { UserDetails } from "../../../entities/user/UserDetails";
// import { updateUser } from "../../services/userUpdateService";

export interface UserState {
  userInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null | undefined;
  isVerified?: boolean;
  user?: OTPVerificationResponse | null;
}

const initialState: UserState = {
  loading: false,
  error: null,
  userInfo: null,
};

// export interface UserState {
//   loading: boolean;
//   error: string;
//   userInfo: UserDetails | null;
//   tutorInfo: UserDetails | null;
//   isAuthenticated: boolean;
// }

// const initialState: UserState = {
//   loading: false,
//   error: "",
//   userInfo: null,
//   tutorInfo: null,
//   isAuthenticated: false,
// };

// export const updateUserDetails = createAsyncThunk<
//   UserDetails,
//   { userId: string; userData: Partial<UserDetails> },
//   { rejectValue: string }
// >(
//   "user/updateUserDetails",
//   async ({ userId, userData }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.patch(
//         `/users?id=${userId}`,
//         userData
//       );
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(
//           error.response?.data?.message || "Failed to update user details"
//         );
//       }
//       return rejectWithValue("Failed to update user details");
//     }
//   }
// );

// export const updateUserDetails = createAsyncThunk<
//   any,
//   UserDetails,
//   { rejectValue: string }
// >("tutor/updateProfile", async (profileData, thunkAPI) => {
//   try {
//     const response = await axiosInstance.put(
//       "/tutor/update-profile",
//       profileData
//     );

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(errorMessage);
//     }

//     return thunkAPI.rejectWithValue("Failed to update profile");
//   }
// });

// export const updateUser = createAsyncThunk<
//   UserDetails,
//   Partial<UserDetails>,
//   { rejectValue: string }
// >("user/update", async (updateData, { rejectWithValue }) => {
//   try {
//     const response = await axios.put<{ user: UserDetails }>(
//       `/api/users/update`,
//       updateData,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return response.data.user;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to update user"
//       );
//     }
//     return rejectWithValue("An unexpected error occurred");
//   }
// });

// Async thunk to toggle user status
export const toggleUserStatus = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("user/toggleUserStatus", async (userId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/toggle-status?id=${userId}`
    );
    return response.data.isActive;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.TOGGLE_FAIL
      );
    }
    return rejectWithValue(someMessages.TOGGLE_FAIL);
  }
});

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
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.isVerified = true;
        state.user = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.OTP_VERIFICATION_FAIL;
        state.isVerified = false;
      })
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userInfo) {
          state.userInfo.isActive = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // .addCase(updateUser.pending, (state) => {
    //   state.loading = true;
    //   state.error = "";
    // })
    // .addCase(updateUser.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.error = "";
    //   state.userInfo = state.userInfo
    //     ? { ...state.userInfo, ...action.payload }
    //     : action.payload;
    // })
    // .addCase(updateUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Failed to update user";
    // });
  },
});

export default userSlice.reducer;
