import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

// Load saved auth from localStorage
const saved = (() => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  token: saved?.token || null,
  type: saved?.type || "Bearer",
  userId: saved?.userId || null,
  name: saved?.name || null,
  email: saved?.email || null,
  role: saved?.role || null,
  loading: false,
  error: null,
};

// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authService.register(payload);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);
      return res?.data || res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.type = "Bearer";
      state.userId = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.error = null;
      localStorage.removeItem("auth");
    },
    setAuthFromStorage(state, action) {
      const payload = action.payload;
      state.token = payload?.token || state.token;
      state.type = payload?.type || state.type;
      state.userId = payload?.userId || state.userId;
      state.name = payload?.name || state.name;
      state.email = payload?.email || state.email;
      state.role = payload?.role || state.role;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.token = payload?.token;
        state.type = payload?.type || "Bearer";
        state.userId = payload?.userId;
        state.name = payload?.name;
        state.email = payload?.email;
        state.role = payload?.role;
        localStorage.setItem("auth", JSON.stringify(payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.token = payload?.token;
        state.type = payload?.type || "Bearer";
        state.userId = payload?.userId;
        state.name = payload?.name;
        state.email = payload?.email;
        state.role = payload?.role;
        localStorage.setItem("auth", JSON.stringify(payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
