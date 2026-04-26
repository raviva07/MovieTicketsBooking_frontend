// src/services/notificationService.js
import { get, put } from "./api";

const notificationService = {

  // ✅ FETCH MY NOTIFICATIONS
  async fetchMyNotifications() {
    try {
      const res = await get("/notifications/my");

      // 🔥 IMPORTANT: return FULL response
      return res; // NOT res.data
    } catch (error) {
      console.error("❌ Fetch notifications error:", error);
      throw error;
    }
  },

  // ✅ MARK AS READ
  async markAsRead(id) {
    try {
      return await put(`/notifications/${id}/read`);
    } catch (error) {
      console.error("❌ Mark read error:", error);
      throw error;
    }
  },
};

export default notificationService;
