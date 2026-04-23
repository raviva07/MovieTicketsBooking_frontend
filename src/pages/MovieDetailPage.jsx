// src/pages/MovieDetailPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieById, clearCurrentMovie } from "../store/movieSlice";
import { useParams, Link } from "react-router-dom";

const MovieDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: movie, loading, error } = useSelector((s) => s.movie);

  useEffect(() => {
    if (id) dispatch(fetchMovieById(id));
    return () => dispatch(clearCurrentMovie());
  }, [dispatch, id]);

  if (loading) return <div className="container my-4">Loading movie...</div>;
  if (error)
    return (
      <div className="container my-4">
        <div className="alert alert-danger">{error.message || JSON.stringify(error)}</div>
      </div>
    );
  if (!movie) return <div className="container my-4">Movie not found.</div>;

  return (
    <div className="container my-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="card-img-top"
                style={{ objectFit: "cover", height: 420 }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center bg-light" style={{height:420}}>
                <span className="text-muted">No poster</span>
              </div>
            )}
            <div className="card-body">
              <p className="mb-1"><strong>Release:</strong> {movie.releaseDate || "—"}</p>
              <p className="mb-0"><strong>Director:</strong> {movie.director || "—"}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <h2 className="mb-2">{movie.title}</h2>

          <p className="text-muted mb-1">
            <strong>Genres:</strong>{" "}
            {movie.genres && movie.genres.length ? movie.genres.join(", ") : "—"}
          </p>

          <p className="text-muted mb-1">
            <strong>Duration:</strong> {movie.durationMinutes ?? "—"} mins
          </p>

          <p className="text-muted mb-3">
            <strong>Rating:</strong> {movie.rating ?? "—"}
          </p>

          <div className="mb-3">
            <h5 className="h6">Description</h5>
            <p>{movie.description || "No description available."}</p>
          </div>

          <div className="mb-3">
            <h5 className="h6">Cast</h5>
            <p>{movie.cast && movie.cast.length ? movie.cast.join(", ") : "—"}</p>
          </div>

          <div className="mb-3">
            <h5 className="h6">Languages</h5>
            <p>{movie.languages && movie.languages.length ? movie.languages.join(", ") : "—"}</p>
          </div>

          <div className="d-flex gap-2">
            <Link to={`/shows?movieId=${movie.id}`} className="btn btn-primary">
              View Shows
            </Link>
            <Link to="/movies" className="btn btn-outline-secondary">
              Back to list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
