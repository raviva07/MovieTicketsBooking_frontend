// src/services/userService.js
import { api, handleResponse, handleError } from "./api";

const userService = {
  getProfile: async () => {
    try {
      const res = await api.get("/users/profile");
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  updateProfile: async (payload) => {
    try {
      const res = await api.put("/users/profile", payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  getAllUsers: async () => {
    try {
      const res = await api.get("/users/all");
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await api.delete(`/users/${id}`);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  // ✅ THIS WAS MISSING
  updateUser: async (id, payload) => {
    try {
      const res = await api.put(`/users/${id}`, payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default userService;
