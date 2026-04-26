import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import {
  fetchMyNotifications,
  markNotificationAsRead,
} from "../store/notificationSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const auth = useSelector((s) => s.auth || {});
  const { myList = [] } = useSelector((s) => s.notification || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = !!auth?.token;
  const isAdmin =
    auth?.role === "ADMIN" || auth?.role === "ROLE_ADMIN";

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate("/login", { replace: true });
  };

  const activeLink = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-semibold text-warning" : ""}`;

  // ================= FETCH + AUTO REFRESH =================
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchMyNotifications());

      const interval = setInterval(() => {
        dispatch(fetchMyNotifications());
      }, 15000); // 🔥 refresh every 15 sec

      return () => clearInterval(interval);
    }
  }, [dispatch, isLoggedIn]);

  // ================= UNREAD COUNT =================
  const unreadCount = myList.filter((n) => !n.read).length;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        {/* BRAND */}
        <Link
          className="navbar-brand fw-bold"
          to={isLoggedIn ? (isAdmin ? "/admin" : "/") : "/login"}
          onClick={closeMenu}
        >
          🎬 MovieTickets
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* MENU */}
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>

          {/* ================= LEFT SIDE ================= */}
          <ul className="navbar-nav me-auto">

            {/* USER NAV */}
            {!isAdmin && isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink to="/" className={activeLink} onClick={closeMenu}>
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/movies" className={activeLink} onClick={closeMenu}>
                    Movies
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/shows" className={activeLink} onClick={closeMenu}>
                    Shows
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/theaters" className={activeLink} onClick={closeMenu}>
                    Theaters
                  </NavLink>
                </li>
              </>
            )}

            {/* ADMIN NAV */}
            {isAdmin && isLoggedIn && (
              <>
                <li className="nav-item">
                  <NavLink to="/admin" className={activeLink} onClick={closeMenu}>
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/movies" className={activeLink} onClick={closeMenu}>
                    Movies
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/theaters" className={activeLink} onClick={closeMenu}>
                    Theaters
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/shows" className={activeLink} onClick={closeMenu}>
                    Shows
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/seats" className={activeLink} onClick={closeMenu}>
                    Manage Seats
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/bookings" className={activeLink} onClick={closeMenu}>
                    Bookings
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/admin/users" className={activeLink} onClick={closeMenu}>
                    Users
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* ================= RIGHT SIDE ================= */}
          <ul className="navbar-nav ms-auto">

            {isLoggedIn ? (
              <>

                {/* 🔔 NOTIFICATION BELL (FIXED) */}
                {!isAdmin && (
                  <li className="nav-item dropdown me-3 position-relative">

                    <button
                      className="btn btn-dark position-relative"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      📩
                      {unreadCount > 0 && (
                        <span
                          className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                          style={{ fontSize: "10px" }}
                        >
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {/* DROPDOWN */}
                    {showNotifications && (
                      <div
                        className="dropdown-menu dropdown-menu-end show p-2"
                        style={{
                          width: "320px",
                          maxHeight: "400px",
                          overflowY: "auto",
                        }}
                      >
                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-center px-2 mb-2">
                          <strong>Inbox</strong>
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowNotifications(false)}
                          >
                            ✖
                          </span>
                        </div>

                        {/* EMPTY */}
                        {myList.length === 0 && (
                          <p className="text-muted px-2">No notifications</p>
                        )}

                        {/* LIST */}
                        {myList.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={`dropdown-item small ${
                              !n.read ? "bg-light fw-bold" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              dispatch(markNotificationAsRead(n.id));
                              navigate("/notifications"); // 🔥 go to inbox
                              setShowNotifications(false);
                            }}
                          >
                            <div>{n.title}</div>

                            <div className="text-muted">
                              {n.message?.length > 40
                                ? n.message.slice(0, 40) + "..."
                                : n.message}
                            </div>
                          </div>
                        ))}

                        {/* VIEW ALL */}
                        {myList.length > 5 && (
                          <div className="text-center mt-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                navigate("/notifications");
                                setShowNotifications(false);
                              }}
                            >
                              View All
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                )}

                {/* USER ONLY */}
                {!isAdmin && (
                  <li className="nav-item">
                    <NavLink
                      to="/bookings"
                      className={activeLink}
                      onClick={closeMenu}
                    >
                      My Bookings
                    </NavLink>
                  </li>
                )}

                {/* PROFILE */}
                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className={activeLink}
                    onClick={closeMenu}
                  >
                    {auth?.name || auth?.email || "Profile"}
                  </NavLink>
                </li>

                {/* LOGOUT */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={activeLink}
                    onClick={closeMenu}
                  >
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className={activeLink}
                    onClick={closeMenu}
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
