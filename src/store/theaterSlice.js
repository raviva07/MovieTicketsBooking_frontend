// src/store/theaterSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import theaterService from "../services/theaterService";

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

// Helper to normalize API responses
const unwrap = (res) => res?.data ?? res;

// ================= FETCH ALL =================
export const fetchTheaters = createAsyncThunk(
  "theater/fetchTheaters",
  async (_, { rejectWithValue }) => {
    try {
      const res = await theaterService.getAll();
      return unwrap(res);
    } catch (err) {
      return rejectWithValue(err?.data?.message || err?.message || "Failed to fetch theaters");
    }
  }
);

// ================= FETCH BY ID =================
export const fetchTheaterById = createAsyncThunk(
  "theater/fetchTheaterById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await theaterService.getById(id);
      return unwrap(res);
    } catch (err) {
      return rejectWithValue(err?.data?.message || err?.message || "Failed to fetch theater");
    }
  }
);

// ================= CREATE =================
export const createTheater = createAsyncThunk(
  "theater/createTheater",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await theaterService.create(payload);
      return unwrap(res);
    } catch (err) {
      return rejectWithValue(err?.data?.message || err?.message || "Failed to create theater");
    }
  }
);

// ================= UPDATE =================
export const updateTheater = createAsyncThunk(
  "theater/updateTheater",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await theaterService.update(id, payload);
      return unwrap(res);
    } catch (err) {
      return rejectWithValue(err?.data?.message || err?.message || "Failed to update theater");
    }
  }
);

// ================= DELETE =================
export const deleteTheater = createAsyncThunk(
  "theater/deleteTheater",
  async (id, { rejectWithValue }) => {
    try {
      await theaterService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.data?.message || err?.message || "Failed to delete theater");
    }
  }
);

const theaterSlice = createSlice({
  name: "theater",
  initialState,
  reducers: {
    clearTheaterError(state) {
      state.error = null;
    },
    clearCurrentTheater(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ================= FETCH ALL =================
      .addCase(fetchTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheaters.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload || [];
      })
      .addCase(fetchTheaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= FETCH BY ID =================
      .addCase(fetchTheaterById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTheaterById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload || null;
      })
      .addCase(fetchTheaterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= CREATE =================
      .addCase(createTheater.fulfilled, (state, action) => {
        const t = action.payload;
        if (t) state.list.unshift(t);
      })

      // ================= UPDATE =================
      .addCase(updateTheater.fulfilled, (state, action) => {
        const t = action.payload;
        if (t) {
          state.list = state.list.map((x) =>
            x.id === t.id ? t : x
          );
          if (state.current?.id === t.id) state.current = t;
        }
      })

      // ================= DELETE =================
      .addCase(deleteTheater.fulfilled, (state, action) => {
        state.list = state.list.filter((x) => x.id !== action.payload);
      });
  },
});

export const { clearTheaterError, clearCurrentTheater } = theaterSlice.actions;

export default theaterSlice.reducer;
