// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// import { signUpUser, verifyOTP } from "../../services/UserSignupServices";
// import { SignUpFormValues } from "../../../entities/user/SignUpFormValues";
// import { OTPVerificationResponse } from "../../../entities/user/OTPValues";
// import { UserDetails } from "../../../entities/user/UserDetails";
// import { someMessages } from "../../../utils/constants";

// export interface TutorState {
//   tutorInfo: SignUpFormValues | null;
//   loading: boolean;
//   error: string | null;
//   isVerified?: boolean;
//   tutor?: OTPVerificationResponse | null;
// }

// const initialState: TutorState = {
//   loading: false,
//   error: null,
//   tutorInfo: null,
// };

// export const updateTutorProfile = createAsyncThunk<
//   any,
//   UserDetails,
//   { rejectValue: string }
// >("tutor/updateProfile", async (profileData, thunkAPI) => {
//   try {
//     const response = await axios.put("/tutor/update-profile", profileData);

//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.message || error.message;
//       return thunkAPI.rejectWithValue(errorMessage);
//     }

//     return thunkAPI.rejectWithValue("Failed to update profile");
//   }
// });

// const tutorSlice = createSlice({
//   name: "tutor",
//   initialState,
//   reducers: {
//     setTutorInfo: (state, action) => {
//       state.tutorInfo = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(signUpUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(signUpUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.tutorInfo = action.meta.arg;
//       })
//       .addCase(signUpUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(verifyOTP.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(verifyOTP.fulfilled, (state, action) => {
//         state.loading = false;
//         state.isVerified = true;
//         state.tutor = action.payload;
//       })
//       .addCase(verifyOTP.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || someMessages.OTP_VERIFICATION_FAIL;
//         state.isVerified = false;
//       });
//   },
// });

// export const { setTutorInfo } = tutorSlice.actions;
// export default tutorSlice.reducer;
