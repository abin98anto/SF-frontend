import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { AppRootState } from "../store";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";
import { someMessages } from "../../utils/constants";

export const updateUser = createAsyncThunk<
  UserDetails,
  Partial<UserDetails>,
  {
    state: AppRootState;
    rejectValue: string;
  }
>("user/update", async (updateData, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const id = state.tutor.userInfo?._id;
    if (!id) {
      return rejectWithValue(someMessages.TUTOR_UPDATE_FAIL);
    }
    const response = await axiosInstance.patch(
      `/tutor/update-profile?id=${id}`,
      updateData
    );
    console.log("the response user/update", response);
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
    state: AppRootState;
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

export const completeLesson = createAsyncThunk(
  "courses/completeLesson",
  async (
    {
      userId,
      courseId,
      lesson,
    }: { userId: string; courseId: string; lesson: string },
    { rejectWithValue }
  ) => {
    console.log("updating course progress...");
    try {
      const response = await axiosInstance.post("/lesson", {
        userId,
        courseId,
        lesson,
      });
      return response.data; // assuming you return updated user data from the backend
    } catch (error) {
      console.log("error updating lesson in complete lesson", error);
      // return rejectWithValue(error.response?.data || "Something went wrong");
      return rejectWithValue("Something went wrong updating course progress");
    }
  }
);
