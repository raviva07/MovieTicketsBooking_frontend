import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "../services/paymentService";

const initialState = {
  current: null,
  loading: false,
  error: null,
};

// ================= INITIATE =================
export const initiatePayment = createAsyncThunk(
  "payment/initiatePayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await paymentService.initiatePayment(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= VERIFY =================
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await paymentService.verifyPayment(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= FETCH BY BOOKING =================
export const fetchPaymentByBookingId = createAsyncThunk(
  "payment/fetchPaymentByBookingId",
  async (bookingId, { rejectWithValue }) => {
    try {
      const res = await paymentService.getByBookingId(bookingId);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= SLICE =================
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentError(state) {
      state.error = null;
    },
    clearCurrentPayment(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ================= INITIATE =================
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;

        const payment = action.payload?.data ?? action.payload;

        if (payment) {
          state.current = payment;
        }
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= VERIFY =================
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;

        const payment = action.payload?.data ?? action.payload;

        if (payment) {
          state.current = payment;
        } else if (state.current) {
          // fallback if backend returns only success msg
          state.current.status = "SUCCESS";
        }
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= FETCH =================
      .addCase(fetchPaymentByBookingId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentByBookingId.fulfilled, (state, action) => {
        state.loading = false;

        const payment = action.payload?.data ?? action.payload;

        if (payment) {
          state.current = payment;
        }
      })
      .addCase(fetchPaymentByBookingId.rejected, (state, action) => {
        state.loading = false;

        // ⚠️ DO NOT overwrite existing payment on fetch fail
        state.error = action.payload || action.error.message;
      });
  },
});

export const {
  clearPaymentError,
  clearCurrentPayment,
} = paymentSlice.actions;

export default paymentSlice.reducer;
