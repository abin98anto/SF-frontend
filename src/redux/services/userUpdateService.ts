import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";

export const updateUser = createAsyncThunk<
  UserDetails,
  Partial<UserDetails>,
  {
    state: RootState;
    rejectValue: string;
  }
>("tutor/update", async (updateData, { getState, rejectWithValue }) => {
  try {
    // console.log("hellloo");
    // Get current tutor ID from state
    const state = getState();
    const tutorId = state.tutor.userInfo?._id;
    console.log("thehre", state);
    if (!tutorId) {
      console.log("gone..");
      return rejectWithValue("No tutor found. Please login again.");
    }

    // const data = updateData;
    // console.log("first");
    const response = await axiosInstance.put(
      `/update?id=${tutorId}`,
      updateData
    );
    console.log("in the service", response);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update tutor"
      );
    }
    return rejectWithValue("An unexpected error occurred");
  }
});
