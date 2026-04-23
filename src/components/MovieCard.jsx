// src/components/MovieCard.jsx
import React, { useState } from "react";

const MovieCard = ({ movie }) => {
  const [imgError, setImgError] = useState(false);

  if (!movie) return null;

  const poster =
    !imgError && (movie.posterUrl || movie.poster)
      ? movie.posterUrl || movie.poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="col">

      <div
        className="card h-100 border-0 shadow-sm movie-card"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >

        {/* IMAGE */}
        <div
          style={{
            height: "340px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={poster}
            alt={movie.title || "Movie poster"}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-100 h-100"
            style={{
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
          />

          {/* RATING BADGE */}
          <div
            className="position-absolute bottom-0 start-0 w-100 px-2 py-1"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          >
            <span className="badge bg-dark bg-opacity-75">
              ⭐ {movie.rating ?? "NR"}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="card-body p-3">

          {/* TITLE */}
          <h6
            className="fw-bold mb-1 text-truncate"
            title={movie.title}
          >
            {movie.title || "Untitled"}
          </h6>

          {/* GENRE + DURATION */}
          <div className="text-muted small mb-2">
            {movie.genre || "—"} •{" "}
            {movie.duration ? `${movie.duration} mins` : "—"}
          </div>

          {/* DESCRIPTION */}
          {movie.description && (
            <p
              className="small text-muted mb-0"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {movie.description}
            </p>
          )}
        </div>

        {/* FOOTER ACTION */}
        <div className="card-footer bg-white border-0 pt-0 pb-3 px-3">
          <button className="btn btn-outline-dark w-100 btn-sm">
            Book Now
          </button>
        </div>
      </div>

      {/* HOVER EFFECT */}
      <style>
        {`
          .movie-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 12px 30px rgba(0,0,0,0.15);
          }

          .movie-card:hover img {
            transform: scale(1.08);
          }
        `}
      </style>
    </div>
  );
};

export default MovieCard;
