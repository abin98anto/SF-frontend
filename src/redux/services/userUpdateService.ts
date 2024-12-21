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
>("user/update", async (updateData, { getState, rejectWithValue }) => {
  try {
    // console.log("hellloo");
    // Get current tutor ID from state
    const state = getState();
    const id = state.tutor.userInfo?._id;
    // console.log("thehre", state);
    if (!id) {
      // console.log("gone..");
      return rejectWithValue("No tutor found. Please login again.");
    }

    // const data = updateData;
    // console.log("first");
    const response = await axiosInstance.put(`/update?id=${id}`, updateData);
    // console.log("in the service", response);
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
