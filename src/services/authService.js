import { api, handleResponse, handleError } from "./api";

/**
 * Auth service wrapper
 * Endpoints:
 *  - POST /auth/register
 *  - POST /auth/login
 */
const authService = {
  register: async (payload) => {
    try {
      const res = await api.post("/auth/register", payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },

  login: async (payload) => {
    try {
      const res = await api.post("/auth/login", payload);
      return handleResponse(res);
    } catch (err) {
      return handleError(err);
    }
  },
};

export default authService;
