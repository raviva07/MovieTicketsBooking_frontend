import { useSelector, useDispatch } from "react-redux";
import { login, register, logout } from "../store/authSlice";

/**
 * Custom hook for authentication
 * - Exposes auth state and actions
 * - Provides isAuthenticated and isAdmin flags
 */
const useAuth = () => {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const doLogin = async (payload) => {
    // unwrap lets you catch errors in the component
    return dispatch(login(payload)).unwrap();
  };

  const doRegister = async (payload) => {
    return dispatch(register(payload)).unwrap();
  };

  const doLogout = () => {
    dispatch(logout());
    // no need to remove localStorage here, slice already does it
  };

  const isAdmin = auth?.role === "ADMIN" || auth?.role === "ROLE_ADMIN";

  return {
    ...auth,
    login: doLogin,
    register: doRegister,
    logout: doLogout,
    isAuthenticated: !!auth?.token,
    isAdmin,
  };
};

export default useAuth;
