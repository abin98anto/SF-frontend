import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../../../entities/user/UserDetails";
import { loginUser, logoutUser } from "../../services/UserAuthServices";
import { someMessages } from "../../../utils/constants";

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
        state.error = action.payload || someMessages.LOGIN_FAILED;
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
        state.error = action.payload || someMessages.LOGIN_FAILED;
      });
  },
});

export const { resetLoginState, updateUserInfo } = tutorLoginSlice.actions;
export default tutorLoginSlice.reducer;
