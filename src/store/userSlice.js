import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  profile: null,
  users: [],
  loading: false,
  error: null,
};

// ================= PROFILE =================
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getProfile();
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || "Failed");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.updateProfile(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || "Failed");
    }
  }
);

// ================= ADMIN USERS =================
export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await userService.getAllUsers();
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || "Failed");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || "Failed");
    }
  }
);

// ✅ FIXED UPDATE USER
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser(id, payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || "Failed");
    }
  }
);

// ================= SLICE =================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // -------- PROFILE --------
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload?.data || action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload?.data || action.payload;
      })

      // -------- USERS --------
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data || action.payload || [];
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -------- DELETE USER --------
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // -------- UPDATE USER --------
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload?.data || action.payload;

        state.users = state.users.map((u) =>
          u.id === updated.id ? updated : u
        );
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
