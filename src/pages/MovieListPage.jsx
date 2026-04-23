// src/pages/MovieListPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/movieSlice";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";

const MovieListPage = () => {
  const dispatch = useDispatch();
  const { list: movies = [], loading, error } = useSelector((s) => s.movie);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">All Movies</h1>
        <Link to="/admin/movies" className="btn btn-outline-secondary btn-sm">
          Manage Movies
        </Link>
      </div>

      {loading && <div className="alert alert-info">Loading movies...</div>}
      {error && (
        <div className="alert alert-danger">
          {error.message || JSON.stringify(error)}
        </div>
      )}

      {movies.length === 0 && !loading ? (
        <p className="text-muted">No movies found.</p>
      ) : (
        <div className="row g-3">
          {movies.map((m) => (
            <div key={m.id} className="col-6 col-md-4 col-lg-3">
              <Link to={`/movies/${m.id}`} className="text-decoration-none text-dark">
                <MovieCard movie={m} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieListPage;
