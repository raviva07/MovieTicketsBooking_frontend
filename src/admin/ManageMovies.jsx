import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovies,
  createMovieJson,
  createMovieMultipart,
  updateMovie,
  deleteMovie,
} from "../store/movieSlice";

const emptyForm = {
  title: "",
  genres: "",
  // comma separated in UI, converted to array for JSON
  durationMinutes: "",
  rating: "",
  description: "",
  posterUrl: "",
  posterFile: null,
  director: "",
  releaseDate: "",
  languages: "",
  cast: "",
  active: true,
};

const ManageMovies = () => {
  const dispatch = useDispatch();
  const { list: movies = [], loading, error } = useSelector((s) => s.movie);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewingMovie, setViewingMovie] = useState(null);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (name === "posterFile") {
      setForm((f) => ({ ...f, posterFile: files && files[0] ? files[0] : null }));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0) return "Duration must be > 0";
    if (form.rating && (Number(form.rating) < 0 || Number(form.rating) > 10)) return "Rating must be between 0 and 10";
    return null;
  };

  const buildJsonPayload = () => {
    return {
      title: form.title,
      genres: form.genres ? form.genres.split(",").map((g) => g.trim()) : [],
      durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
      rating: form.rating ? Number(form.rating) : null,
      description: form.description,
      posterUrl: form.posterUrl,
      releaseDate: form.releaseDate || null,
      languages: form.languages ? form.languages.split(",").map((l) => l.trim()) : [],
      cast: form.cast ? form.cast.split(",").map((c) => c.trim()) : [],
      director: form.director,
      active: form.active,
    };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) return alert(errMsg);
    try {
      setSubmitting(true);
      // If a file is selected, use multipart endpoint (matches Swagger)
      if (form.posterFile) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description || "");
        fd.append("director", form.director || "");
        fd.append("posterUrl", form.posterUrl || "");
        fd.append("posterFile", form.posterFile);
        fd.append("durationMinutes", form.durationMinutes || "");
        fd.append("rating", form.rating || "");
        // For arrays, append as repeated fields or as JSON string — backend expects Set<String> for genres.
        // We'll append genres as repeated param if present
        if (form.genres) {
          form.genres.split(",").map((g) => g.trim()).forEach((g) => fd.append("genres", g));
        }
        if (form.languages) {
          form.languages.split(",").map((l) => l.trim()).forEach((l) => fd.append("languages", l));
        }
        if (form.cast) {
          form.cast.split(",").map((c) => c.trim()).forEach((c) => fd.append("cast", c));
        }
        await dispatch(createMovieMultipart(fd)).unwrap();
      } else {
        // JSON create
        const payload = buildJsonPayload();
        await dispatch(createMovieJson(payload)).unwrap();
      }
      alert("Movie created");
      setForm(emptyForm);
      dispatch(fetchMovies());
    } catch (err) {
      alert(err?.message || err?.data?.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title || "",
      genres: movie.genres ? movie.genres.join(", ") : "",
      durationMinutes: movie.durationMinutes || "",
      rating: movie.rating || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      posterFile: null,
      director: movie.director || "",
      releaseDate: movie.releaseDate || "",
      languages: movie.languages ? movie.languages.join(", ") : "",
      cast: movie.cast ? movie.cast.join(", ") : "",
      active: movie.active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const errMsg = validate();
    if (errMsg) return alert(errMsg);
    try {
      setSubmitting(true);
      // 🔥 STEP 1: Build payload
      const rawPayload = buildJsonPayload();
      // 🔥 STEP 2: Remove empty values (VERY IMPORTANT FIX)
      const cleanedPayload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, value]) => {
          if (value === null) return false;
          if (value === "") return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        })
      );
      // 🔥 STEP 3: Send only changed fields
      await dispatch(
        updateMovie({
          id: editingId,
          payload: cleanedPayload,
        })
      ).unwrap();
      alert("Movie updated");
      setEditingId(null);
      setForm(emptyForm);
      dispatch(fetchMovies());
    } catch (err) {
      alert(err?.message || err?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await dispatch(deleteMovie(id)).unwrap();
      alert("Movie deleted");
      dispatch(fetchMovies());
    } catch (err) {
      alert(err?.message || err?.data?.message || "Delete failed");
    }
  };

  // New: View handler
  const handleView = (movie) => {
    setViewingMovie(movie);
    // optionally scroll to top or focus
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeView = () => setViewingMovie(null);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Manage Movies</h1>

      <div className="card p-4 mb-4 shadow-sm">
        <h4 className="mb-3">{editingId ? "Edit Movie" : "Create Movie"}</h4>
        <form onSubmit={editingId ? handleUpdate : handleCreate}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Title *</label>
              <input
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Director</label>
              <input name="director" className="form-control" value={form.director} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Genres (comma separated)</label>
              <input name="genres" className="form-control" value={form.genres} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Duration (mins) *</label>
              <input
                name="durationMinutes"
                type="number"
                className="form-control"
                value={form.durationMinutes}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                className="form-control"
                value={form.rating}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Poster URL</label>
              <input name="posterUrl" className="form-control" value={form.posterUrl} onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Poster File</label>
              <input
                name="posterFile"
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleChange}
              />
              <small className="form-text text-muted">
                If you upload a file, it will be sent as multipart and stored on Cloudinary.
              </small>
            </div>

            <div className="col-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Languages (comma separated)</label>
              <input name="languages" className="form-control" value={form.languages} onChange={handleChange} />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Cast (comma separated)</label>
              <input name="cast" className="form-control" value={form.cast} onChange={handleChange} />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Release Date</label>
              <input name="releaseDate" type="date" className="form-control" value={form.releaseDate} onChange={handleChange} />
            </div>

            <div className="col-md-2 mb-3 d-flex align-items-center">
              <div className="form-check mt-2">
                <input
                  name="active"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.active}
                  onChange={handleChange}
                />
                <label className="form-check-label">Active</label>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <button className="btn btn-primary me-2" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Movie" : "Create Movie"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        {loading && <p>Loading movies...</p>}
        {error && <div className="alert alert-danger">{error.message || JSON.stringify(error)}</div>}

        {movies.length === 0 ? (
          <p className="text-muted">No movies found</p>
        ) : (
          <div className="list-group">
            {movies.map((m) => (
              <div key={m.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {m.posterUrl && (
                    <img
                      src={m.posterUrl}
                      alt={m.title}
                      className="img-thumbnail me-3"
                      style={{ width: 100, height: "auto", objectFit: "cover" }}
                    />
                  )}
                  <div>
                    <h5 className="mb-1">{m.title}</h5>
                    <small className="text-muted">
                      {m.genres?.join(", ")} • {m.durationMinutes} mins • {m.rating}
                    </small>
                    <p className="mb-0 mt-1">{m.description}</p>
                  </div>
                </div>

                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleView(m)}>
                    View
                  </button>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(m)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewingMovie && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1040 }}
            onClick={closeView}
            aria-hidden="true"
          />
          <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1050 }}
            aria-modal="true"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{viewingMovie.title}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={closeView} />
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-4 text-center mb-3">
                      {viewingMovie.posterUrl ? (
                        <img
                          src={viewingMovie.posterUrl}
                          alt={viewingMovie.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: 320, objectFit: "cover" }}
                        />
                      ) : (
                        <div className="border rounded p-4 text-muted">No poster available</div>
                      )}
                    </div>

                    <div className="col-md-8">
                      <p>
                        <strong>Director:</strong> {viewingMovie.director || "—"}
                      </p>
                      <p>
                        <strong>Genres:</strong> {viewingMovie.genres && viewingMovie.genres.length > 0 ? viewingMovie.genres.join(", ") : "—"}
                      </p>
                      <p>
                        <strong>Duration:</strong> {viewingMovie.durationMinutes ? `${viewingMovie.durationMinutes} mins` : "—"}
                      </p>
                      <p>
                        <strong>Rating:</strong> {viewingMovie.rating ?? "—"}
                      </p>
                      <p>
                        <strong>Release Date:</strong> {viewingMovie.releaseDate || "—"}
                      </p>
                      <p>
                        <strong>Languages:</strong> {viewingMovie.languages && viewingMovie.languages.length > 0 ? viewingMovie.languages.join(", ") : "—"}
                      </p>
                      <p>
                        <strong>Cast:</strong> {viewingMovie.cast && viewingMovie.cast.length > 0 ? viewingMovie.cast.join(", ") : "—"}
                      </p>
                      <p>
                        <strong>Active:</strong> {viewingMovie.active ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  <hr />

                  <div>
                    <h6>Description</h6>
                    <p className="mb-0">{viewingMovie.description || "No description provided."}</p>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeView}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      // Open edit from view
                      handleEdit(viewingMovie);
                      closeView();
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageMovies;
