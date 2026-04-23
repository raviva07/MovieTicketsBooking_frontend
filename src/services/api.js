// src/services/api.js
import axios from "axios";


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});


api.interceptors.request.use(
  (config) => {
    try {
      const raw = localStorage.getItem("auth");

      if (raw) {
        const auth = JSON.parse(raw);

        if (auth?.token) {
          config.headers = config.headers || {};
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


export const handleResponse = (res) => {
  if (!res) return null;
  return res.data !== undefined ? res.data : res;
};


export const handleError = (err) => {
  if (err?.response?.data) {
    return Promise.reject(err.response.data);
  }

  return Promise.reject({
    success: false,
    message: err?.message || "Network Error",
  });
};
