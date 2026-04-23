import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showService from "../services/showService";

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

// ================= FETCH ALL =================
export const fetchShows = createAsyncThunk(
  "show/fetchShows",
  async (_, { rejectWithValue }) => {
    try {
      const res = await showService.getAllShows();
      return res?.data ?? res ?? [];
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch shows");
    }
  }
);

// ================= FETCH BY ID =================
export const fetchShowById = createAsyncThunk(
  "show/fetchShowById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await showService.getShowById(id);
      return res?.data ?? res ?? null;
    } catch (err) {
      return rejectWithValue(err?.message || "Failed to fetch show");
    }
  }
);

// ================= CREATE =================
export const createShow = createAsyncThunk(
  "show/createShow",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await showService.createShow(payload);
      return res?.data ?? res;
    } catch (err) {
      return rejectWithValue(err?.message || "Create failed");
    }
  }
);

// ================= UPDATE =================
export const updateShow = createAsyncThunk(
  "show/updateShow",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await showService.updateShow(id, payload);
      return res?.data ?? res;
    } catch (err) {
      return rejectWithValue(err?.message || "Update failed");
    }
  }
);

// ================= DELETE =================
export const deleteShow = createAsyncThunk(
  "show/deleteShow",
  async (id, { rejectWithValue }) => {
    try {
      await showService.deleteShow(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.message || "Delete failed");
    }
  }
);

const showSlice = createSlice({
  name: "show",
  initialState,
  reducers: {
    clearShowError: (state) => {
      state.error = null;
    },
    clearCurrentShow: (state) => {
      state.current = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH ALL
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH BY ID
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.current = action.payload;
      })

      // CREATE
      .addCase(createShow.fulfilled, (state, action) => {
        if (action.payload) state.list.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateShow.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map((s) =>
          s.id === updated.id ? updated : s
        );
      })

      // DELETE
      .addCase(deleteShow.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s.id !== action.payload);
      });
  },
});

export const { clearShowError, clearCurrentShow } = showSlice.actions;
export default showSlice.reducer;
