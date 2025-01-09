import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserDetails } from "../../entities/user/UserDetails";
import { RootState } from "../store";
import axios from "axios";
import axiosInstance from "../../utils/axiosConfig";
import { someMessages } from "../../utils/constants";

export const verifyTutor = createAsyncThunk<
  UserDetails,
  Partial<UserDetails>,
  {
    state: RootState;
    rejectValue: string;
  }
>("user/update", async (updateData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/update?id=${updateData._id}`,
      updateData
    );
    return response.data.user;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || someMessages.USER_UPDATE_FAIL
      );
    }
    return rejectWithValue(someMessages.USER_UPDATE_FAIL);
  }
});
