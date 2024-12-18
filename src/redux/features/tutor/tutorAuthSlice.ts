import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
import { UserDetails } from "../../../entities/user/UserDetails";
// import { LoginFormValues } from "../../../entities/LoginFormValues";
import { loginUser, logoutUser } from "../../services/UserAuthServices";

// export interface tutorDetails {
//   id?: string;
//   email: string;
//   name?: string;
//   role?: string;
//   resume?: string;
//   profilePicture?: string;
// }

// export interface TutorLoginFormValues {
//   email: string;
//   password: string;
// }

export interface TutorState {
  loading: boolean;
  error: string;
  tutorInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: TutorState = {
  loading: false,
  error: "",
  tutorInfo: null,
  isAuthenticated: false,
};

// Correct type definition for createAsyncThunk
// export const loginUser = createAsyncThunk<
//   { message: string; user: UserDetails }, // Return type
//   LoginFormValues, // First argument type
//   { rejectValue: string } // ThunkAPI config type
// >("tutor/login", async (credentials, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/tutor/login",
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
//   void, // Return type
//   void, // First argument type (none in this case)
//   { rejectValue: string } // ThunkAPI config type
// >("tutor/logout", async (_, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/tutor/logout",
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

const tutorLoginSlice = createSlice({
  name: "tutorLogin",
  initialState,
  reducers: {
    resetLoginState: (state) => {
      state.loading = false;
      state.error = "";
      state.isAuthenticated = false;
    },
    updateUserInfo: (state, action: PayloadAction<Partial<UserDetails>>) => {
      state.tutorInfo = state.tutorInfo
        ? { ...state.tutorInfo, ...action.payload }
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
        state.tutorInfo = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.tutorInfo = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.tutorInfo = null;
        state.error = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });
  },
});

export const { resetLoginState, updateUserInfo } = tutorLoginSlice.actions;
export default tutorLoginSlice.reducer;
