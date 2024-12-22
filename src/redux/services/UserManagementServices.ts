import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axiosInstance from "../../utils/axiosConfig";
import { UserRole } from "../../entities/user/UserRole";

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

export const denyTutor = createAsyncThunk(
  "tutors/denyTutor",
  async (tutorId: string, { rejectWithValue }) => {
    try {
      console.log("first", tutorId);
      const response = await axiosInstance.post(
        `/admin/deny-tutor?id=${tutorId}`
      );
      console.log("response thunk", response);
      return response.data;
    } catch (error: any) {
      if (error.isAxiosError && error.response?.status === 400) {
        // Likely caused by invalid tutorId format (CastError)
        return rejectWithValue("Invalid tutor ID format");
      }
      // Handle other errors
      return rejectWithValue(
        error.response?.data?.message || "Failed to deny the tutor"
      );
    }
  }
);
