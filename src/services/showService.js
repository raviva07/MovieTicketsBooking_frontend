// src/services/showService.js
import { api, handleResponse, handleError } from "./api";

const showService = {
  getAllShows: async () => {
    try {
      const res = await api.get("/shows");
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getShowById: async (id) => {
    try {
      const res = await api.get(`/shows/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // 🔥 FIXED (MOST IMPORTANT)
  getByTheater: async (theaterId) => {
    try {
      const res = await api.get(`/shows/theater/${theaterId}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  createShow: async (payload) => {
    try {
      const res = await api.post("/shows", payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  updateShow: async (id, payload) => {
    try {
      const res = await api.put(`/shows/${id}`, payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  deleteShow: async (id) => {
    try {
      const res = await api.delete(`/shows/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default showService;
