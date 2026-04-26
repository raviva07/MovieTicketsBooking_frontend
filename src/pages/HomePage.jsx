// src/pages/HomePage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieSlice";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dispatch = useDispatch();

  const { list: movies = [], loading, error } =
    useSelector((s) => s.movie || {});

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <div className="container my-4">

      {/* 🔝 TOP BAR */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Now Showing</h1>

        <Link to="/movies" className="btn btn-outline-secondary btn-sm">
          All Movies
        </Link>
      </div>

      {/* ================= STATUS ================= */}

      {loading && (
        <div className="alert alert-info">Loading movies...</div>
      )}

      {error && (
        <div className="alert alert-danger">
          {typeof error === "string" ? error : error?.message}
        </div>
      )}

      {/* ================= MOVIES ================= */}

      <div
        className="movie-grid d-flex flex-wrap gap-3"
        style={{ rowGap: 16 }}
      >
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((m) => (
            <div key={m.id} className="d-inline-block text-center">

              {/* 🎬 Movie Card */}
              <Link
                to={`/movies/${m.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <MovieCard movie={m} />
              </Link>

              {/* 🎯 ACTIONS */}
              <div className="mt-2">
                <Link
                  to={`/shows?movieId=${m.id}`}
                  className="btn btn-sm btn-outline-primary me-2"
                >
                  View Shows
                </Link>

                <Link
                  to={`/movies/${m.id}`}
                  className="btn btn-sm btn-outline-secondary"
                >
                  Details
                </Link>
              </div>

            </div>
          ))
        ) : (
          !loading && (
            <p className="text-muted">No movies available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
