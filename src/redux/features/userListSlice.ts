import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  isActive?: boolean;
}

interface UserState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (): Promise<User[]> => {
    const response = await axios.get<User[]>(
      "http://localhost:3000/admin/users"
    );
    return response.data;
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    updateUserStatusLocally: (
      state,
      action: PayloadAction<{ userId: string; isActive: boolean }>
    ) => {
      const { userId, isActive } = action.payload;
      const user = state.users.find((u) => u._id === userId);
      if (user) {
        user.isActive = isActive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export const selectUsers = (state: RootState) => state.userList.users;
export const selectUsersStatus = (state: RootState) => state.userList.status;
export const selectUsersError = (state: RootState) => state.userList.error;
export const { updateUserStatusLocally } = userListSlice.actions;

export default userListSlice.reducer;
