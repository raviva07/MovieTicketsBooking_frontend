// src/store/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookingService from "../services/bookingService";

const initialState = {
  current: null,
  list: [], // user bookings (array of BookingResponse)
  allBookings: null, // admin paged response (ApiResponse<Page<BookingResponse>>)
  pageable: { number: 0, size: 10, totalPages: 1, totalElements: 0 },
  loading: false,
  error: null,
};

// ================= ADMIN =================
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAllBookings",
  async (params = { page: 0, size: 10 }, { rejectWithValue }) => {
    try {
      const res = await bookingService.fetchAll(params);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= USER =================
export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (params = { page: 0, size: 10 }, { rejectWithValue }) => {
    try {
      const res = await bookingService.fetchMy(params);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= CREATE =================
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await bookingService.create(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= GET BY ID =================
export const fetchBookingById = createAsyncThunk(
  "booking/fetchBookingById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await bookingService.getById(id);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= CONFIRM =================
export const confirmBookingPayment = createAsyncThunk(
  "booking/confirmBookingPayment",
  async ({ id, paymentId }, { rejectWithValue }) => {
    try {
      const res = await bookingService.confirm(id, paymentId);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= CANCEL =================
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (id, { rejectWithValue }) => {
    try {
      const res = await bookingService.cancel(id);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= SLICE =================
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearCurrentBooking(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
  builder

    // ================= ADMIN =================
    .addCase(fetchAllBookings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllBookings.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const page = response?.data || response;

      // ✅ store normalized page only
      state.allBookings = page;
    })
    .addCase(fetchAllBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // ================= MY BOOKINGS =================
    .addCase(fetchMyBookings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchMyBookings.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const page = response?.data || response;

      state.list = page?.content || [];

      state.pageable = {
        number: page?.number ?? 0,
        size: page?.size ?? 10,
        totalPages: page?.totalPages ?? 1,
        totalElements: page?.totalElements ?? 0,
      };

      // ✅ IMPORTANT: DO NOT TOUCH allBookings here
    })
    .addCase(fetchMyBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // ================= CREATE =================
    .addCase(createBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const booking = response?.data ?? response;

      if (booking) {
        state.current = booking;
        state.list = [
          booking,
          ...state.list.filter((b) => b.id !== booking.id),
        ];

        if (response?.data && state.pageable) {
          state.pageable.totalElements =
            (state.pageable.totalElements || 0) + 1;
        }
      }
    })
    .addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // ================= GET BY ID =================
    .addCase(fetchBookingById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBookingById.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const booking = response?.data ?? response;

      if (booking) {
        state.current = booking;
      }
    })
    .addCase(fetchBookingById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // ================= CONFIRM =================
    .addCase(confirmBookingPayment.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(confirmBookingPayment.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const data = response?.data ?? response;

      if (data && typeof data === "object" && data.id) {
        const updated = data;

        state.current = updated;

        state.list = state.list.map((b) =>
          b.id === updated.id ? updated : b
        );
      } else {
        const arg = action.meta.arg || {};
        const id = arg.id;
        const paymentId = arg.paymentId;

        if (state.current && state.current.id === id) {
          state.current.status = "CONFIRMED";
          if (paymentId) state.current.paymentId = paymentId;
        }

        state.list = state.list.map((b) =>
          b.id === id
            ? { ...b, status: "CONFIRMED", paymentId: paymentId || b.paymentId }
            : b
        );
      }
    })
    .addCase(confirmBookingPayment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })

    // ================= CANCEL =================
    .addCase(cancelBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(cancelBooking.fulfilled, (state, action) => {
      state.loading = false;

      const response = action.payload;
      const data = response?.data ?? response;

      if (data && typeof data === "object" && data.id) {
        const updated = data;

        state.current = updated;

        state.list = state.list.map((b) =>
          b.id === updated.id ? updated : b
        );
      } else {
        const id = action.meta.arg;

        if (state.current && state.current.id === id) {
          state.current.status = "CANCELLED";
        }

        state.list = state.list.map((b) =>
          b.id === id ? { ...b, status: "CANCELLED" } : b
        );
      }
    })
    .addCase(cancelBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    });
},
});

export const { clearBookingError, clearCurrentBooking } = bookingSlice.actions;

export default bookingSlice.reducer;
