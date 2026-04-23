// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../store/userSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((s) => s.user);

  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setForm({ name: profile.name, email: profile.email });
  }, [profile]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(form)).unwrap();
      alert("Profile updated ✅");
    } catch (err) {
      alert(err?.message || "Update failed");
    }
  };

  return (
    <div className="container my-4">
      <h2>My Profile</h2>
      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" className="form-control" value={form.email} onChange={handleChange} />
        </div>
        <button className="btn btn-primary" disabled={loading}>Save</button>
      </form>
    </div>
  );
};

export default ProfilePage;
