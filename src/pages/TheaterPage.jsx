// src/pages/TheaterPage.jsx
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTheaters,
  fetchTheaterById,
  clearCurrentTheater,
} from "../store/theaterSlice";
import { Link, useParams } from "react-router-dom";

const TheaterCard = ({ t }) => {
  const location = [t.address, t.city, t.state, t.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{t.name || "Unnamed Theater"}</h5>

        <p className="card-text small text-muted mb-2">
          {location || "Location not provided"}
        </p>

        <div className="mb-2 small text-muted">
          <div>
            <strong>Screens:</strong> {t.screens ?? "—"}
          </div>
          <div>
            <strong>Seats layout:</strong>{" "}
            {Array.isArray(t.seatLayout) ? t.seatLayout.length : "—"}
          </div>
        </div>

        <div className="mt-auto d-flex gap-2">
          <Link
            to={`/theaters/${t.id}`}
            className="btn btn-sm btn-outline-primary w-100"
          >
            View
          </Link>
          <Link
            to={`/shows?theaterId=${t.id}`}
            className="btn btn-sm btn-primary w-100"
          >
            Shows
          </Link>
        </div>
      </div>

      <div className="card-footer small text-muted d-flex justify-content-between">
        <span>{t.contactEmail || "—"}</span>
        <span>{t.phone || "—"}</span>
      </div>
    </div>
  );
};

const TheaterPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { list: theaters = [], current, loading, error } = useSelector(
    (s) => s.theater
  );

  // ================= LOAD DATA =================
  useEffect(() => {
    dispatch(fetchTheaters());

    if (id) {
      dispatch(clearCurrentTheater()); // FIX: prevent stale UI
      dispatch(fetchTheaterById(id));
    }

    return () => {
      dispatch(clearCurrentTheater());
    };
  }, [dispatch, id]);

  // ================= SORT =================
  const sorted = useMemo(() => {
    if (!Array.isArray(theaters)) return [];
    return [...theaters].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
  }, [theaters]);

  // ================= ERROR SAFE =================
  const errorMessage = useMemo(() => {
    if (!error) return null;
    return typeof error === "string"
      ? error
      : error?.message || JSON.stringify(error);
  }, [error]);

  return (
    <div className="container my-4">
      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Theaters</h1>

        <div>
          <Link to="/" className="btn btn-sm btn-outline-secondary me-2">
            Home
          </Link>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => dispatch(fetchTheaters())}
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" />
          <div className="mt-2 text-muted">Loading theaters…</div>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}

      {/* LIST */}
      <div className="row g-3">
        {sorted.length === 0 && !loading ? (
          <div className="col-12">
            <div className="card p-4 text-center text-muted">
              No theaters found.
            </div>
          </div>
        ) : (
          sorted.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-lg-4">
              <TheaterCard t={t} />
            </div>
          ))
        )}
      </div>

      {/* DETAILS */}
      {current && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h4 className="card-title mb-1">{current.name}</h4>

                <p className="mb-1 text-muted">
                  {[current.address, current.city, current.state, current.country]
                    .filter(Boolean)
                    .join(", ") || "Location not provided"}
                </p>

                <p className="mb-1 small text-muted">
                  <strong>Contact:</strong> {current.contactEmail || "—"} •{" "}
                  {current.phone || "—"}
                </p>

                <p className="mb-1 small text-muted">
                  <strong>Screens:</strong> {current.screens ?? "—"} •{" "}
                  <strong>Seat groups:</strong>{" "}
                  {Array.isArray(current.seatLayout)
                    ? current.seatLayout.length
                    : "—"}
                </p>
              </div>

              <div className="text-end">
                <Link
                  to={`/shows?theaterId=${current.id}`}
                  className="btn btn-primary me-2"
                >
                  View Shows
                </Link>
                <Link
                  to="/admin/theaters"
                  className="btn btn-outline-secondary"
                >
                  Manage
                </Link>
              </div>
            </div>

            {/* SEAT PREVIEW */}
            {Array.isArray(current.seatLayout) &&
              current.seatLayout.length > 0 && (
                <div className="mt-3">
                  <h6 className="mb-2">Seat Layout Preview</h6>

                  <div className="d-flex flex-wrap gap-2">
                    {current.seatLayout.slice(0, 12).map((row, idx) => (
                      <div
                        key={idx}
                        className="border rounded p-2 small bg-light"
                      >
                        {typeof row === "string"
                          ? row
                          : JSON.stringify(row)}
                      </div>
                    ))}

                    {current.seatLayout.length > 12 && (
                      <div className="align-self-center small text-muted">
                        +{current.seatLayout.length - 12} more
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* METADATA */}
            {current.metadata && (
              <div className="mt-3 small text-muted">
                <strong>Metadata:</strong>{" "}
                {JSON.stringify(current.metadata)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TheaterPage;
