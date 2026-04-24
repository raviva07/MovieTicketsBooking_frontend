// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://movieticketsbooking-backend.onrender.com/api";

// ✅ Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // JWT-based auth (no cookies)
  timeout: 15000, // prevent hanging requests
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");

      if (raw) {
        const auth = JSON.parse(raw);

        if (auth?.token) {
          config.headers = config.headers || {};

          // ✅ Attach JWT token
          config.headers.Authorization = `${
            auth.type || "Bearer"
          } ${auth.token}`;
        }
      }
    } catch (e) {
      console.error("Auth parse error:", e);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => {
    // ✅ Directly return data
    return response?.data ?? response;
  },
  (error) => {
    // 🔥 Debug logs (VERY IMPORTANT)
    console.error("API Error:", error);

    // ✅ Backend returned structured error
    if (error?.response) {
      return Promise.reject({
        success: false,
        status: error.response.status,
        message:
          error.response.data?.message ||
          "Server error occurred",
        data: error.response.data || null,
      });
    }

    // ❌ Network error / timeout
    return Promise.reject({
      success: false,
      message: "Network error. Please check your connection.",
    });
  }
);

// ================= OPTIONAL HELPERS =================

// GET
export const get = (url, config = {}) => api.get(url, config);

// POST
export const post = (url, data, config = {}) =>
  api.post(url, data, config);

// PUT
export const put = (url, data, config = {}) =>
  api.put(url, data, config);

// DELETE
export const del = (url, config = {}) =>
  api.delete(url, config);
