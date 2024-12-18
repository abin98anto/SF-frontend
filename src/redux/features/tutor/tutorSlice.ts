import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { tutorSignupMessages } from "../../../utils/constants";
import { signUpUser, verifyOTP } from "../../services/UserSignupServices";
import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
import { OTPVerificationResponse } from "../../../entities/user/OTPValues";

export interface TutorState {
  tutorInfo: SignUpFormValues | null;
  loading: boolean;
  error: string | null;
  isVerified?: boolean;
  tutor?: OTPVerificationResponse | null;
}

const initialState: TutorState = {
  loading: false,
  error: null,
  tutorInfo: null,
};

// Async thunk to handle tutor sign-up
// export const signUpTutor = createAsyncThunk(
//   "tutor/sendOTP",
//   async (tutorData: TutorSignUpFormValues, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/tutor/signup",
//         tutorData
//       );

//       // console.log("alien", response);

//       if (response.data.message === tutorSignupMessages.EMAIL_EXISTS) {
//         return rejectWithValue(tutorSignupMessages.EMAIL_EXISTS);
//       }
//       return response.data;
//     } catch (error: any) {
//       // console.log("erroror", error);
//       if (
//         axios.isAxiosError(error) &&
//         error.response?.data?.message === tutorSignupMessages.EMAIL_EXISTS
//       ) {
//         return rejectWithValue(tutorSignupMessages.EMAIL_EXISTS);
//       }

//       return rejectWithValue(
//         error.response?.data || tutorSignupMessages.UNKNOWN_ERROR
//       );
//     }
//   }
// );

// export const verifyTutorOTP = createAsyncThunk<
//   OTPVerificationResponse,
//   OTPVerificationPayload,
//   { rejectValue: string }
// >("tutor/verifyOTP", async (payload, thunkAPI) => {
//   try {
//     const response = await axios.post(
//       "http://localhost:3000/tutor/verify-otp",
//       payload
//     );

//     // console.log("resssponsee", response);
//     if (response.data.success) {
//       return response.data;
//     } else {
//       if (response.data.message === "Invalid OTP") {
//         return thunkAPI.rejectWithValue(tutorSignupMessages.WRONG_OTP);
//       } else if (response.data.message === "OTP expired") {
//         return thunkAPI.rejectWithValue(tutorSignupMessages.OTP_EXPIRED);
//       } else {
//         return thunkAPI.rejectWithValue(
//           tutorSignupMessages.OTP_VERIFICATION_FAIL
//         );
//       }
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.error || error.message;
//       return thunkAPI.rejectWithValue(errorMessage);
//     }

//     return thunkAPI.rejectWithValue(tutorSignupMessages.UNKNOWN_ERROR);
//   }
// });

// In your TutorSignUpFormValues.ts or a similar file
export interface UpdateTutorProfilePayload {
  name?: string;
  email?: string;
  profilePicture?: string;
  resume?: string;
}

export const updateTutorProfile = createAsyncThunk<
  any,
  UpdateTutorProfilePayload,
  { rejectValue: string }
>("tutor/updateProfile", async (profileData, thunkAPI) => {
  try {
    const response = await axios.put("/tutor/update-profile", profileData);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(errorMessage);
    }

    return thunkAPI.rejectWithValue("Failed to update profile");
  }
});

const tutorSlice = createSlice({
  name: "tutor",
  initialState,
  reducers: {
    setTutorInfo: (state, action) => {
      state.tutorInfo = action.payload;
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
        state.tutorInfo = action.meta.arg;
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
        state.tutor = action.payload;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || tutorSignupMessages.OTP_VERIFICATION_FAIL;
        state.isVerified = false;
      });
  },
});

export const { setTutorInfo } = tutorSlice.actions;
export default tutorSlice.reducer;
