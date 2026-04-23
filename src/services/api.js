// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Attach JWT token if present (stored as JSON under "auth")
api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const auth = JSON.parse(raw);
        if (auth?.token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `${auth.type || "Bearer"} ${auth.token}`;
        }
      }
    } catch (e) {
      // ignore parse errors and continue without token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * SAFE RESPONSE HANDLER
 *
 * Keep compatibility with existing frontend layers:
 * - Backend responses are wrapped as ApiResponse { success, message, data }.
 * - Return the full wrapper when available (res.data), otherwise return raw response.
 */
export const handleResponse = (res) => {
  if (!res) return null;
  // If axios response has a data object (ApiResponse), return it as-is
  if (res.data !== undefined) return res.data;
  return res;
};

/**
 * SAFE ERROR HANDLER
 *
 * Return a rejected Promise with the backend error payload when available
 * so calling code can catch and inspect it. Otherwise return a normalized error object.
 */
export const handleError = (err) => {
  // If server returned a structured error payload, reject with that
  if (err?.response?.data) {
    return Promise.reject(err.response.data);
  }

  // Otherwise reject with a normalized object
  return Promise.reject({
    success: false,
    message: err?.message || "Network Error",
  });
};
