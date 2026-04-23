import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const auth = useSelector((s) => s.auth || {});
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

          {/* LEFT SIDE */}
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
  <NavLink className="nav-link" to="/admin/seats">
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

          {/* RIGHT SIDE */}
          <ul className="navbar-nav ms-auto">

            {isLoggedIn ? (
              <>
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
