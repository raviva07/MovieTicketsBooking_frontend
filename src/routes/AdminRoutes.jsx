import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * AdminRoute
 * - Allows ONLY ADMIN users
 * - Blocks normal users
 */
const AdminRoute = ({ redirectTo = "/login" }) => {
  const { token, role } = useSelector((s) => s.auth || {});

  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
