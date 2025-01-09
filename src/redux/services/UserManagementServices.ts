import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axiosInstance from "../../utils/axiosConfig";
import { UserRole } from "../../entities/user/UserRole";
import { someMessages } from "../../utils/constants";

export const getUsers = createAsyncThunk<
  UserDetails[],
  UserRole,
  {
    state: RootState;
    rejectValue: string;
  }
>("admin/users", async (role, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/admin/list?role=${role}`);
    return response.data.data;
  } catch (error) {
    console.log(someMessages.USERS_FETCH_FAIL, error);
    return rejectWithValue(someMessages.USERS_FETCH_FAIL);
  }
});

export const toggleUserStatus = createAsyncThunk<
  string,
  string,
  {
    state: RootState;
    rejectValue: string;
  }
>("admin/toggleUserStatus", async (userId, { rejectWithValue }) => {
  try {
    await axiosInstance.patch(`/admin/toggle-status?id=${userId}`);
    return userId;
  } catch (error) {
    console.error(someMessages.USER_TOOGLE_FAIL, error);
    return rejectWithValue(someMessages.USER_TOOGLE_FAIL);
  }
});

export const denyTutor = createAsyncThunk(
  "tutors/denyTutor",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/admin/deny-tutor?id=${tutorId}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.DENY_TUTOR_FAIL
      );
    }
  }
);
