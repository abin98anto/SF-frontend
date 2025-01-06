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
    const state = getState();
    const id = state.tutor.userInfo?._id;
    if (!id) {
      return rejectWithValue("No tutor found. Please login again.");
    }
    const response = await axiosInstance.patch(`/update?id=${id}`, updateData);
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

export const updateStudent = createAsyncThunk<
  UserDetails,
  Partial<UserDetails>,
  {
    state: RootState;
    rejectValue: string;
  }
>("student/update", async (updateData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const id = state.user.userInfo?._id;
    if (!id) {
      return rejectWithValue("No tutor found. Please login again.");
    }
    const response = await axiosInstance.patch(`/update?id=${id}`, updateData);
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
