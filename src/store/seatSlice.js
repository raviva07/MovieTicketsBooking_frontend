// src/store/seatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import seatService from "../services/seatService";

const initialState = {
  layout: [], // array of seat objects from backend
  loading: false,
  error: null,
  lastReserved: [], // last reserved seat ids (locked)
};

export const fetchSeatsByTheater = createAsyncThunk(
  "seat/fetchSeatsByTheater",
  async (theaterId, { rejectWithValue }) => {
    try {
      const res = await seatService.getSeats(theaterId);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

/**
 * payload: { showId, userId, seatIds: [string], lockSeconds?: number }
 */
export const reserveSeats = createAsyncThunk(
  "seat/reserveSeats",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await seatService.reserve(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

/**
 * seatIds: [string]
 */
export const confirmSeats = createAsyncThunk(
  "seat/confirmSeats",
  async (seatIds, { rejectWithValue }) => {
    try {
      const res = await seatService.confirm(seatIds);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

/**
 * seatIds: [string]
 */
export const releaseSeats = createAsyncThunk(
  "seat/releaseSeats",
  async (seatIds, { rejectWithValue }) => {
    try {
      const res = await seatService.release(seatIds);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

const seatSlice = createSlice({
  name: "seat",
  initialState,
  reducers: {
    clearSeatError(state) {
      state.error = null;
    },
    clearSeatLayout(state) {
      state.layout = [];
      state.lastReserved = [];
    },
    // optimistic UI helper: toggle selection locally
    toggleSelectSeat(state, action) {
      const seatId = action.payload;
      const seat = state.layout.find((s) => s.id === seatId);
      if (!seat) return;
      // only allow selecting AVAILABLE seats
      if (seat.status === "AVAILABLE") {
        seat._selected = !seat._selected;
      }
    },
    // reset local selections
    clearSelections(state) {
      state.layout.forEach((s) => (s._selected = false));
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSeatsByTheater
      .addCase(fetchSeatsByTheater.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatsByTheater.fulfilled, (state, action) => {
        state.loading = false;
        // backend wraps response in { success, message, data }
        const seats = action.payload?.data || action.payload || [];
        // normalize: ensure each seat has _selected flag
        state.layout = seats.map((s) => ({ ...s, _selected: false }));
      })
      .addCase(fetchSeatsByTheater.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // reserveSeats
      .addCase(reserveSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reserveSeats.fulfilled, (state, action) => {
        state.loading = false;
        // backend returns success message; we keep lastReserved from action.meta.arg.seatIds
        const seatIds = action.meta.arg?.seatIds || [];
        state.lastReserved = seatIds;
        // mark seats as LOCKED locally
        state.layout = state.layout.map((s) =>
          seatIds.includes(s.id) ? { ...s, status: "LOCKED", lockedBy: "you", _selected: false } : s
        );
      })
      .addCase(reserveSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // confirmSeats
      .addCase(confirmSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmSeats.fulfilled, (state, action) => {
        state.loading = false;
        const seatIds = action.meta.arg || [];
        // mark seats as BOOKED
        state.layout = state.layout.map((s) =>
          seatIds.includes(s.id) ? { ...s, status: "BOOKED", lockedBy: null } : s
        );
        // clear lastReserved if they were confirmed
        state.lastReserved = state.lastReserved.filter((id) => !seatIds.includes(id));
      })
      .addCase(confirmSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // releaseSeats
      .addCase(releaseSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(releaseSeats.fulfilled, (state, action) => {
        state.loading = false;
        const seatIds = action.meta.arg || [];
        // mark seats as AVAILABLE
        state.layout = state.layout.map((s) =>
          seatIds.includes(s.id) ? { ...s, status: "AVAILABLE", lockedBy: null } : s
        );
        // remove from lastReserved
        state.lastReserved = state.lastReserved.filter((id) => !seatIds.includes(id));
      })
      .addCase(releaseSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSeatError, clearSeatLayout, toggleSelectSeat, clearSelections } = seatSlice.actions;
export default seatSlice.reducer;
