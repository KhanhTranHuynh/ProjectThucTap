// redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk để gọi API
export const fetchUserEmail = createAsyncThunk(
  "user/fetchUserEmail",
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:55009/api/userRouter/getemailwithtoken?token=${token}`
      );
      return response.data.payload;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.email = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload;
      })
      .addCase(fetchUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
