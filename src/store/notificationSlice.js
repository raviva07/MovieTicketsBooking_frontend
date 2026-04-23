// src/store/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../services/notificationService";

const initialState = {
  list: [],        // 🔥 local + admin notifications
  myList: [],      // 🔥 user notifications from backend
  loading: false,
  error: null,
};

// ================= ASYNC THUNKS =================

// Admin: send notification
export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await notificationService.sendNotification(payload);
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// User: fetch my notifications
export const fetchMyNotifications = createAsyncThunk(
  "notification/fetchMyNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await notificationService.fetchMyNotifications();
      return res;
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Admin: fetch user notifications
export const fetchNotificationsByUser = createAsyncThunk(
  "notification/fetchNotificationsByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await notificationService.fetchNotificationsByUser(userId);
      return { userId, res };
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// Mark as read
export const markNotificationAsRead = createAsyncThunk(
  "notification/markNotificationAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await notificationService.markAsRead(id);
      return { id, res };
    } catch (err) {
      return rejectWithValue(err?.message || err?.data?.message || err);
    }
  }
);

// ================= SLICE =================

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // 🔥 LOCAL TOAST NOTIFICATION (VERY IMPORTANT)
    addLocal(state, action) {
      const id = Date.now().toString();

      state.list.unshift({
        id,
        message: action.payload.message,
        type: action.payload.type || "info", // success | danger | info
        read: false,
      });
    },

    clearNotificationError(state) {
      state.error = null;
    },

    clearMyNotifications(state) {
      state.myList = [];
    },

    clearNotifications(state) {
      state.list = [];
    },

    removeNotification(state, action) {
      const id = action.payload;

      state.list = state.list.filter((n) => n.id !== id);
      state.myList = state.myList.filter((n) => n.id !== id);
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= SEND =================
      .addCase(sendNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.loading = false;

        const created = action.payload?.data ?? action.payload;

        if (created) {
          state.list.unshift(created);
        }
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= FETCH MY =================
      .addCase(fetchMyNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.loading = false;

        state.myList = action.payload?.data ?? action.payload ?? [];
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= ADMIN FETCH =================
      .addCase(fetchNotificationsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsByUser.fulfilled, (state, action) => {
        state.loading = false;

        const res = action.payload?.res;

        state.list = res?.data ?? res ?? [];
      })
      .addCase(fetchNotificationsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ================= MARK READ =================
      .addCase(markNotificationAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload?.id;

        const markRead = (arr) =>
          Array.isArray(arr)
            ? arr.map((n) =>
                n.id === id ? { ...n, read: true } : n
              )
            : arr;

        state.myList = markRead(state.myList);
        state.list = markRead(state.list);
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// ================= EXPORTS =================

export const {
  addLocal,
  clearNotificationError,
  clearMyNotifications,
  clearNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
