import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
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
    // console.log("heyo", response);
    return response.data;
  }
);

export const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {},
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

export default userListSlice.reducer;
