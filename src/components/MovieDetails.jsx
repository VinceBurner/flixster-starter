import React from "react";
import "./MovieDetails.css";

export default function MovieDetails({ movie, onClose }) {
  if (!movie) return null;

  const {
    title,
    runtime,
    release_date,
    vote_average,
    backdrop_path,
    genres = [],
    overview,
  } = movie;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        {backdrop_path && (
          <img
            className="backdrop"
            src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
            alt={`Backdrop for ${title}`}
          />
        )}

        <h2>{title}</h2>
        <p>
          <strong>Runtime:</strong> {runtime} minutes
        </p>
        <p>
          <strong>Release Date:</strong> {release_date}
        </p>
        <p>
          <strong>Rating:</strong> ⭐ {vote_average}
        </p>
        {genres.length > 0 && (
          <p>
            <strong>Genres:</strong> {genres.map((g) => g.name).join(", ")}
          </p>
        )}
        <p className="overview">{overview}</p>
      </div>
    </div>
  );
}
