import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axiosInstance from "../../utils/axiosConfig";

export const getUsers = createAsyncThunk<
  UserDetails[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("admin/users", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/admin/users`);
    return response.data.data;
  } catch (error) {
    console.log("Error getting the users", error);
    return rejectWithValue("Failed to fetch users");
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
    console.error("Error toggling user active state", error);
    return rejectWithValue("Failed to update user state");
  }
});
