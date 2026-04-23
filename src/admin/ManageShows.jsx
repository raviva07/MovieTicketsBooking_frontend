// src/admin/ManageShows.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShows,
  createShow,
  updateShow,
  deleteShow,
} from "../store/showSlice";
import { fetchMovies } from "../store/movieSlice";
import { fetchTheaters } from "../store/theaterSlice";

const emptyForm = {
  movieId: "",
  theaterId: "",
  startTime: "",
  endTime: "",
  defaultPrice: "",
  screen: "",
  language: "",
  active: true,
};

const toISO = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? val : d.toISOString();
};

const ManageShows = () => {
  const dispatch = useDispatch();

  const { list: shows = [], loading, error } = useSelector((s) => s.show);
  const movies = useSelector((s) => s.movie.list) || [];
  const theaters = useSelector((s) => s.theater.list) || [];

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [viewShow, setViewShow] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    dispatch(fetchShows());
    dispatch(fetchMovies());
    dispatch(fetchTheaters());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await dispatch(createShow({
      ...form,
      startTime: toISO(form.startTime),
      endTime: toISO(form.endTime),
      defaultPrice: Number(form.defaultPrice || 0),
    }));
    setForm(emptyForm);
    dispatch(fetchShows());
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setForm({
      ...s,
      startTime: s.startTime?.slice(0, 16),
      endTime: s.endTime?.slice(0, 16),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await dispatch(updateShow({
      id: editingId,
      payload: {
        ...form,
        startTime: toISO(form.startTime),
        endTime: toISO(form.endTime),
        defaultPrice: Number(form.defaultPrice || 0),
      },
    }));
    setEditingId(null);
    setForm(emptyForm);
    dispatch(fetchShows());
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this show?")) return;
    await dispatch(deleteShow(id));
    dispatch(fetchShows());
  };

  const filtered = shows.filter((s) =>
    `${s.movieTitle} ${s.theaterName} ${s.id}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="container py-4">

      {/* HEADER (BMS STYLE) */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">🎬 Manage Shows</h2>
          <small className="text-muted">Admin control panel</small>
        </div>

        <input
          className="form-control"
          style={{ width: 260 }}
          placeholder="Search shows..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      {/* FORM CARD */}
      <div className="card shadow-lg border-0 mb-4 rounded-4">
        <div className="card-body">
          <h5 className="mb-3">
            {editingId ? "✏️ Edit Show" : "➕ Create Show"}
          </h5>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="row g-3">

              <div className="col-md-6">
                <select className="form-select" name="movieId" onChange={handleChange} value={form.movieId}>
                  <option>Select Movie</option>
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select className="form-select" name="theaterId" onChange={handleChange} value={form.theaterId}>
                  <option>Select Theater</option>
                  {theaters.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <input type="datetime-local" className="form-control" name="startTime"
                  value={form.startTime} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <input type="datetime-local" className="form-control" name="endTime"
                  value={form.endTime} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <input className="form-control" name="defaultPrice" placeholder="Price"
                  value={form.defaultPrice} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <input className="form-control" name="screen" placeholder="Screen"
                  value={form.screen} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <input className="form-control" name="language" placeholder="Language"
                  value={form.language} onChange={handleChange} />
              </div>

              <div className="col-12 d-flex gap-2">
                <button className="btn btn-dark px-4">
                  {editingId ? "Update Show" : "Create Show"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>

      {/* SHOW CARDS (BMS STYLE) */}
      <div className="row g-3">
        {filtered.map((s) => (
          <div key={s.id} className="col-md-6 col-lg-4">

            <div className="card border-0 shadow-sm h-100 rounded-4 hover-shadow">

              <div className="card-body">

                <h5 className="fw-bold mb-1">{s.movieTitle}</h5>

                <p className="text-muted small mb-2">
                  🎭 {s.theaterName}
                </p>

                <div className="d-flex flex-wrap gap-2 mb-2">
                  <span className="badge bg-primary">₹{s.defaultPrice}</span>
                  <span className={`badge ${s.active ? "bg-success" : "bg-secondary"}`}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <small className="text-muted d-block">
                  {new Date(s.startTime).toLocaleString()}
                </small>

                {/* ACTIONS */}
                <div className="d-flex gap-2 mt-3">

                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => setViewShow(s)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(s.id)}
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>

          </div>
        ))}
      </div>

      {/* VIEW MODAL */}
      {/* VIEW MODAL */}
{viewShow && (
  <div
    className="modal d-block"
    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content rounded-4 shadow-lg border-0">

        {/* HEADER */}
        <div className="modal-header border-0">
          <div>
            <h5 className="fw-bold mb-0">🎬 Show Details</h5>
            <small className="text-muted">Complete information</small>
          </div>
          <button
            className="btn-close"
            onClick={() => setViewShow(null)}
          />
        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* MOVIE + THEATER SECTION */}
          <div className="p-3 rounded-3 bg-light mb-3">

            <h5 className="fw-bold text-dark mb-2">
              🎥 Movie:{" "}
              {viewShow.movieTitle ||
                movies.find((m) => m.id === viewShow.movieId)?.title ||
                "N/A"}
            </h5>

            <h6 className="text-muted mb-0">
              🎭 Theater:{" "}
              {viewShow.theaterName ||
                theaters.find((t) => t.id === viewShow.theaterId)?.name ||
                "N/A"}
            </h6>

          </div>

          {/* INFO GRID */}
          <div className="row g-3">

            <div className="col-md-6">
              <div className="p-3 border rounded-3">
                <div className="text-muted small">💰 Price</div>
                <div className="fw-bold">₹{viewShow.defaultPrice}</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 border rounded-3">
                <div className="text-muted small">🎬 Screen</div>
                <div className="fw-bold">{viewShow.screen || "N/A"}</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 border rounded-3">
                <div className="text-muted small">🌐 Language</div>
                <div className="fw-bold">{viewShow.language || "N/A"}</div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 border rounded-3">
                <div className="text-muted small">📌 Status</div>
                <span
                  className={`badge ${
                    viewShow.active ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {viewShow.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

          </div>

          {/* TIME SECTION */}
          <div className="mt-3 p-3 border rounded-3 bg-white">
            <div className="fw-semibold mb-2">⏰ Schedule</div>

            <div className="d-flex justify-content-between">
              <div>
                <div className="text-muted small">Start</div>
                <div>
                  {new Date(viewShow.startTime).toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-muted small">End</div>
                <div>
                  {new Date(viewShow.endTime).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="modal-footer border-0">
          <button
            className="btn btn-dark px-4"
            onClick={() => setViewShow(null)}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ManageShows;
