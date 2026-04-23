// src/services/notificationService.js
import { api, handleResponse, handleError } from "./api";

/**
 * notificationService
 * - POST   /api/notifications           -> send notification (ADMIN)
 * - GET    /api/notifications/my        -> get current user's notifications (USER)
 * - GET    /api/notifications/user/{id} -> get notifications for a user (ADMIN)
 * - PUT    /api/notifications/{id}/read -> mark notification as read (USER|ADMIN)
 *
 * All responses are normalized via handleResponse / handleError.
 */

const notificationService = {
  sendNotification: async (payload) => {
    try {
      const res = await api.post("/notifications", payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  fetchMyNotifications: async () => {
    try {
      const res = await api.get("/notifications/my");
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  fetchNotificationsByUser: async (userId) => {
    try {
      const res = await api.get(`/notifications/user/${userId}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  markAsRead: async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default notificationService;
