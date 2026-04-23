import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRole }) => {
  const { token, role } = useSelector((s) => s.auth);
  const location = useLocation();

  // 🔐 Not logged in
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 👑 Role check
  if (requiredRole) {
    const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
    const isUser = role === "USER" || role === "ROLE_USER";

    // ✅ ADMIN only route
    if (requiredRole === "ADMIN" || requiredRole === "ROLE_ADMIN") {
      if (!isAdmin) {
        return <Navigate to="/" replace />;
      }
    }

    // ✅ USER only route (ALLOW ADMIN ALSO)
    if (requiredRole === "USER" || requiredRole === "ROLE_USER") {
      if (!isUser && !isAdmin) {
        return <Navigate to="/" replace />;
      }
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
