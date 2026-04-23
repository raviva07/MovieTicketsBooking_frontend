// src/pages/ShowPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchShows,
  fetchShowById,
  clearCurrentShow,
} from "../store/showSlice";
import { Link, useParams } from "react-router-dom";

const ShowPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { list = [], current, loading, error } =
    useSelector((s) => s.show) || {};

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 8;

  // ================= FETCH =================
  useEffect(() => {
    if (id) {
      dispatch(fetchShowById(id));
    } else {
      dispatch(fetchShows());
    }

    return () => dispatch(clearCurrentShow());
  }, [dispatch, id]);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return list.filter((s) => {
      const title = (s.movieTitle || "").toLowerCase();
      const theater = (s.theaterName || "").toLowerCase();
      return title.includes(q) || theater.includes(q);
    });
  }, [list, search]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString() : "-";

  // ================= IMAGE FIX =================
  const fallbackImage =
    "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";

  const getPoster = (s) => {
    return (
      s.posterUrl ||
      s.moviePoster ||
      s.movie?.posterUrl ||
      fallbackImage
    );
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <h2 className="text-center mb-4 fw-bold text-dark">
        🎬 Now Showing
      </h2>

      {/* SEARCH */}
      {!id && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              className="form-control shadow-sm rounded-pill px-4"
              placeholder="Search movies or theaters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && <div className="text-center">Loading shows...</div>}

      {/* ERROR */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ================= LIST ================= */}
      {!id && !loading && (
        <>
          <div className="row g-4">

            {paginated.map((s) => (
              <div key={s.id} className="col-lg-3 col-md-4 col-sm-6">

                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "0.3s",
                  }}
                >
                  {/* IMAGE */}
                  <img
                    src={getPoster(s)}
                    alt="poster"
                    onError={(e) => (e.target.src = fallbackImage)}
                    style={{
                      height: "240px",
                      objectFit: "cover",
                    }}
                  />

                  {/* BODY */}
                  <div className="card-body d-flex flex-column">

                    <h6 className="fw-bold mb-1">
                      {s.movieTitle || "Untitled"}
                    </h6>

                    <small className="text-muted">
                      🕒 {formatDate(s.startTime)}
                    </small>

                    <small className="text-muted mb-2">
                      📍 {s.theaterName}
                    </small>

                    <Link
                      to={`/shows/${s.id}`}
                      className="btn btn-outline-dark btn-sm mt-auto rounded-pill"
                    >
                      View Details
                    </Link>

                  </div>
                </div>

              </div>
            ))}

          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-4 gap-3">
            <button
              className="btn btn-outline-secondary"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>

            <button
              className="btn btn-outline-secondary"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* ================= DETAIL ================= */}
      {id && current && (
        <div className="card border-0 shadow-lg">

          <div className="row g-0">

            {/* IMAGE */}
            <div className="col-md-4">
              <img
                src={getPoster(current)}
                onError={(e) => (e.target.src = fallbackImage)}
                className="img-fluid h-100"
                style={{ objectFit: "cover" }}
                alt="poster"
              />
            </div>

            {/* DETAILS */}
            <div className="col-md-8">
              <div className="card-body p-4">

                <h3 className="fw-bold mb-2">
                  {current.movieTitle}
                </h3>

                <p className="text-muted mb-2">
                  🕒 {formatDate(current.startTime)}
                </p>

                <p className="text-muted mb-2">
                  📍 {current.theaterName}
                </p>

                <p className="mb-3">
                  🎥 Screen: {current.screen} <br />
                  🌐 Language: {current.language}
                </p>

                <div className="d-flex gap-2">
                  <Link
                    to={`/shows/${current.id}/seats`}
                    className="btn btn-dark px-4"
                  >
                    🎟 Book Seats
                  </Link>

                  <Link
                    to="/shows"
                    className="btn btn-outline-secondary"
                  >
                    Back
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShowPage;
