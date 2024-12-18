import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { UserRole } from "../../entities/SignUpFormValues";
import { loginUser, logoutUser } from "../services/UserAuthServices";
import { UserDetails } from "../../entities/UserDetails";

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
  isAuthenticated: boolean;
}

const initialState: UserState = {
  loading: false,
  error: "",
  userInfo: null,
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
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.userInfo = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { resetLoginState, updateUserInfo } = userLoginSlice.actions;
export default userLoginSlice.reducer;
