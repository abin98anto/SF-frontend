import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";
import { someMessages } from "../../utils/constants";

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
      return rejectWithValue(someMessages.TUTOR_UPDATE_FAIL);
    }
    const response = await axiosInstance.patch(`/update?id=${id}`, updateData);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.TUTOR_UPDATE_FAIL
      );
    }
    return rejectWithValue(someMessages.UNKNOWN_ERROR);
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
      return rejectWithValue(someMessages.USER_NOT_FOUND);
    }
    const response = await axiosInstance.patch(`/update?id=${id}`, updateData);
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.USER_UPDATE_FAIL
      );
    }
    return rejectWithValue(someMessages.UNKNOWN_ERROR);
  }
});
