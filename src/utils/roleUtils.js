import { ROLE } from "./constants";

/**
 * Normalize role from backend
 * Converts ROLE_ADMIN → ADMIN
 */
export const normalizeRole = (role) => {
  if (!role) return null;

  if (role === ROLE.ROLE_ADMIN) return ROLE.ADMIN;
  if (role === ROLE.ROLE_USER) return ROLE.USER;

  return role;
};

/**
 * Check if user is ADMIN
 */
export const isAdmin = (role) => {
  const r = normalizeRole(role);
  return r === ROLE.ADMIN;
};

/**
 * Check if user is USER
 */
export const isUser = (role) => {
  const r = normalizeRole(role);
  return r === ROLE.USER;
};

/**
 * Check if authenticated (has valid token)
 */
export const isAuthenticated = (auth) => {
  return !!auth?.token;
};

/**
 * Role hierarchy (for future scaling)
 * ADMIN > USER
 */
export const hasRole = (userRole, requiredRole) => {
  const hierarchy = {
    [ROLE.USER]: 1,
    [ROLE.ADMIN]: 2,
  };

  const r1 = hierarchy[normalizeRole(userRole)] || 0;
  const r2 = hierarchy[normalizeRole(requiredRole)] || 0;

  return r1 >= r2;
};

/**
 * Safe role label (UI display)
 */
export const getRoleLabel = (role) => {
  const r = normalizeRole(role);

  if (r === ROLE.ADMIN) return "Admin";
  if (r === ROLE.USER) return "User";

  return "Guest";
};
