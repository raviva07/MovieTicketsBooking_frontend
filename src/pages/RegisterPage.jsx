// src/pages/RegisterPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token, role } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_USER", // ✅ FIXED
  });

  // ================= REDIRECT AFTER REGISTER =================
  useEffect(() => {
    if (token) {
      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [token, role, navigate]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  // ================= UI =================
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          borderRadius: "15px",
        }}
      >
        <h2 className="text-center mb-3 fw-bold text-primary">
          🎬 Create Account
        </h2>

        <p className="text-center text-muted mb-4">
          Join MovieTickets and book your favorite shows
        </p>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center">
            {typeof error === "string"
              ? error
              : error?.message || "Registration failed"}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* ROLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Register As</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="fw-semibold text-decoration-none">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
