import { STORAGE_KEYS } from "./constants";

// ================= STORE AUTH =================
export const storeAuth = (authPayload) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify(authPayload)
    );
  } catch (err) {
    console.error("Error storing auth:", err);
  }
};

// ================= LOAD AUTH =================
export const loadAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Error loading auth:", err);
    return null;
  }
};

// ================= CLEAR AUTH =================
export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (err) {
    console.error("Error clearing auth:", err);
  }
};

// ================= GET TOKEN =================
export const getTokenFromStorage = () => {
  const auth = loadAuth();
  const data = auth?.data || auth;

  return data?.token || null;
};

// ================= GET ROLE =================
export const getUserRoleFromStorage = () => {
  const auth = loadAuth();
  const data = auth?.data || auth;

  return data?.role || null;
};
