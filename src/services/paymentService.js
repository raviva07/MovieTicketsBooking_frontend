// src/services/paymentService.js
import { api } from "./api";

const paymentService = {
  // ================= INITIATE =================
  initiatePayment: async (payload) => {
    try {
      const res = await api.post("/payments/initiate", payload);

      // ✅ IMPORTANT FIX
      return res?.data?.data || res?.data || null;

    } catch (err) {
      console.error("INITIATE ERROR:", err);
      throw err?.response?.data || err;
    }
  },

  // ================= VERIFY =================
  verifyPayment: async (payload) => {
    try {
      const res = await api.post("/payments/verify", payload);

      // ✅ IMPORTANT FIX
      return res?.data?.data || res?.data || null;

    } catch (err) {
      console.error("VERIFY ERROR:", err);
      throw err?.response?.data || err;
    }
  },

  // ================= GET BY BOOKING =================
  getByBookingId: async (bookingId) => {
    try {
      const res = await api.get(`/payments/booking/${bookingId}`);

      // ✅ IMPORTANT FIX
      return res?.data?.data || res?.data || null;

    } catch (err) {
      console.error("FETCH PAYMENT ERROR:", err);

      // If no payment exists, return null instead of breaking UI
      if (err?.response?.status === 404) {
        return null;
      }

      throw err?.response?.data || err;
    }
  },
};

export default paymentService;
