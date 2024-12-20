import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../../../entities/user/UserDetails";
import { loginTutor } from "../../services/UserAuthServices";
import { someMessages } from "../../../utils/constants";

export interface TutorState {
  loading: boolean;
  error: string;
  userInfo: UserDetails | null;
  isAuthenticated: boolean;
}

const initialState: TutorState = {
  loading: false,
  error: "",
  userInfo: null,
  isAuthenticated: false,
};

const tutorSlice = createSlice({
  name: "tutor",
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
      .addCase(loginTutor.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginTutor.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";
        state.userInfo = action.payload.user;
      })
      .addCase(loginTutor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || someMessages.LOGIN_FAILED;
      });
  },
});

export const { resetLoginState, updateUserInfo } = tutorSlice.actions;
export default tutorSlice.reducer;
