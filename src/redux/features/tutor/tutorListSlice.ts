import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import axiosInstance from "../../../utils/axiosConfig";

interface Tutor {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  isActive?: boolean;
  rating: number;
  batchesHandling: number;
  reviewsTaken: number;
  sessionsTaken: number;
}

interface TutorState {
  tutors: Tutor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TutorState = {
  tutors: [],
  status: "idle",
  error: null,
};

export const fetchTutors = createAsyncThunk(
  "tutors/fetchUsers",
  async (): Promise<Tutor[]> => {
    const response = await axiosInstance.get<Tutor[]>("/admin/tutors");
    return response.data;
  }
);

export const tutorListSlice = createSlice({
  name: "tutorList",
  initialState,
  reducers: {
    updateTutorStatusLocally: (
      state,
      action: PayloadAction<{ userId: string; isActive: boolean }>
    ) => {
      const { userId, isActive } = action.payload;
      const user = state.tutors.find((u) => u._id === userId);
      if (user) {
        user.isActive = isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchTutors.fulfilled,
        (state, action: PayloadAction<Tutor[]>) => {
          state.status = "succeeded";
          state.tutors = action.payload;
        }
      )
      .addCase(fetchTutors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const selectTutors = (state: RootState) => state.tutorList.tutors;
export const selectTutorsStatus = (state: RootState) => state.tutorList.status;
export const selectTutorsError = (state: RootState) => state.tutorList.error;
export const { updateTutorStatusLocally } = tutorListSlice.actions;

export default tutorListSlice.reducer;
