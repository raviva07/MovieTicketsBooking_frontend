// src/store/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../services/notificationService";

// ================= INITIAL STATE =================
const initialState = {
  myList: [],
  loading: false,
  error: null,
};

// ================= ASYNC THUNKS =================

// ✅ Fetch my notifications
export const fetchMyNotifications = createAsyncThunk(
  "notification/fetchMyNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.fetchMyNotifications();

      // ✅ FIXED DATA EXTRACTION
      return Array.isArray(res?.data) ? res.data : [];
    } catch (err) {
      return rejectWithValue(
        err?.message || err?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

// ✅ Mark as read
export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.message || err?.data?.message || "Failed to mark as read"
      );
    }
  }
);

// ================= SLICE =================

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // ✅ Clear all
    clearNotifications(state) {
      state.myList = [];
    },

    // ✅ Add locally
    addLocal(state, action) {
      if (action.payload) {
        state.myList.unshift(action.payload);
      }
    },

    // 🔥 FIX: ADD THIS (your missing export)
    removeNotification(state, action) {
      const id = action.payload;
      state.myList = state.myList.filter((n) => n.id !== id);
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.myList = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= MARK AS READ =================
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;

        state.myList = state.myList.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ================= EXPORT =================

export const {
  clearNotifications,
  addLocal,
  removeNotification, // ✅ NOW EXISTS
} = notificationSlice.actions;

export default notificationSlice.reducer;
