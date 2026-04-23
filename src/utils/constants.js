export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const STORAGE_KEYS = {
  AUTH: "auth",
};

export const ROLE = {
  ADMIN: "ADMIN",
  ROLE_ADMIN: "ROLE_ADMIN",
  USER: "USER",
  ROLE_USER: "ROLE_USER",
};

export const SEAT_STATUS = {
  AVAILABLE: "AVAILABLE",
  LOCKED: "LOCKED",
  BOOKED: "BOOKED",
};

export const DEFAULT_PAGE_SIZE = 10;

export const MESSAGES = {
  NETWORK_ERROR: "Network error. Please try again.",
  UNAUTHORIZED: "You are not authorized. Please login.",
};
