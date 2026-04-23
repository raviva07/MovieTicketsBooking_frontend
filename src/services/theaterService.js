// src/services/theaterService.js
import { api, handleResponse, handleError } from "./api";

const theaterService = {
  // ================= STANDARD METHODS =================

  getAll: async () => {
    try {
      const res = await api.get("/theaters"); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/theaters/${id}`); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  create: async (payload) => {
    try {
      const res = await api.post("/theaters", payload); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  update: async (id, payload) => {
    try {
      const res = await api.put(`/theaters/${id}`, payload); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  delete: async (id) => {
    try {
      const res = await api.delete(`/theaters/${id}`); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // ================= OLD METHODS (FIXED ALSO) =================

  getAllTheaters: async () => {
    try {
      const res = await api.get("/theaters"); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getTheaterById: async (id) => {
    try {
      const res = await api.get(`/theaters/${id}`); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  createTheater: async (payload) => {
    try {
      const res = await api.post("/theaters", payload); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  updateTheater: async (id, payload) => {
    try {
      const res = await api.put(`/theaters/${id}`, payload); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  deleteTheater: async (id) => {
    try {
      const res = await api.delete(`/theaters/${id}`); // ✅ FIXED
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default theaterService;
