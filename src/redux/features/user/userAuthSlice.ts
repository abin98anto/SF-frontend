import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { UserRole } from "../../entities/SignUpFormValues";
import {
  loginTutor,
  loginUser,
  logoutUser,
} from "../services/UserAuthServices";
import { UserDetails } from "../../entities/user/UserDetails";

// export interface UserDetails {
//   id?: string;
//   email: string;
//   name?: string;
//   role?: string;
//   profilePicture?: string;
// }

// export interface LoginFormValues {
//   email: string;
//   password: string;
// }

export interface UserState {
  loading: boolean;
  error: string;
  userInfo: UserDetails | null;
  tutorInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  loading: false,
  error: "",
  userInfo: null,
  tutorInfo: null,
  isAuthenticated: false,
};

// Correct type definition for createAsyncThunk
// export const loginUser = createAsyncThunk<
//   { message: string; user: UserDetails },
//   LoginFormValues,
//   { rejectValue: string }
// >("user/login", async (credentials, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/login",
//       credentials,
//       {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return {
//       message: response.data.message,
//       user: response.data.user,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || error.message || "Login failed"
//       );
//     }

//     return thunkAPI.rejectWithValue("Login failed");
//   }
// });

// export const logoutUser = createAsyncThunk<
//   void,
//   void,
//   { rejectValue: string }
// >("user/logout", async (_, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/logout",
//       {},
//       { withCredentials: true }
//     );

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || error.message || "Logout failed"
//       );
//     }

//     return thunkAPI.rejectWithValue("Logout failed");
//   }
// });

// export const logout = async (role: UserRole) => {
//   try {
//     await fetch(`http://localhost:3000/logout?role=${role}`);
//   } catch (error) {
//     console.log("error loggin out", error);
//   }
// };

// export const logoutUser = createAsyncThunk<
//   void,
//   UserRole,
//   { rejectValue: string }
// >("user/logout", async (role, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/logout",
//       { role },
//       { withCredentials: true }
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || error.message || "Logout failed"
//       );
//     }
//     return thunkAPI.rejectWithValue("Logout failed");
//   }
// });

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.userInfo = state.userInfo
        ? { ...state.userInfo, ...action.payload }
        : null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user; // Update only userInfo
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "User login failed";
      })

      // Tutor Login
      .addCase(loginTutor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.tutorInfo = action.payload.user; // Update only tutorInfo
      })
      .addCase(loginTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Tutor login failed";
      })

      // User Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = "";
        state.userInfo = null; // Clear userInfo only
        state.isAuthenticated = !!state.tutorInfo; // Preserve tutor auth state
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "User logout failed";
      })

      // Handle Tutor Logout (optional: create a separate logout for tutors)
      .addCase("tutor/logout", (state) => {
        state.tutorInfo = null; // Clear tutorInfo
        state.isAuthenticated = !!state.userInfo; // Preserve user auth state
      });
  },
});

export const { resetLoginState, updateUserInfo } = userLoginSlice.actions;
export default userLoginSlice.reducer;
