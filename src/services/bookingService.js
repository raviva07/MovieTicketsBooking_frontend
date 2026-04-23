// src/services/bookingService.js
import { api, handleResponse, handleError } from "./api";

/**
 * bookingService
 * - GET    /api/bookings            -> admin list (paged)
 * - GET    /api/bookings/my         -> user list (paged)
 * - GET    /api/bookings/{id}       -> get booking
 * - POST   /api/bookings            -> create booking
 * - PUT    /api/bookings/{id}/confirm?paymentId=... -> confirm booking
 * - PUT    /api/bookings/{id}/cancel -> cancel booking
 */
const bookingService = {
  // Admin: fetch all bookings (paged)
  fetchAll: async (params = {}) => {
    try {
      const res = await api.get("/bookings", { params });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // User: fetch my bookings (paged)
  fetchMy: async (params = {}) => {
    try {
      const res = await api.get("/bookings/my", { params });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/bookings/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  create: async (payload) => {
    try {
      const res = await api.post("/bookings", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  confirm: async (id, paymentId) => {
    try {
      // axios.put(url, data, config) -> we pass null as body and params in config
      const res = await api.put(`/bookings/${id}/confirm`, null, {
        params: { paymentId },
      });
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  cancel: async (id) => {
    try {
      const res = await api.put(`/bookings/${id}/cancel`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default bookingService;


