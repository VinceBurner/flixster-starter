import React from "react";
import "./MovieCard.css";

export default function MovieCard({
  title,
  posterPath,
  voteAverage,
  movie,
  isFavorite,
  isWatched,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddToWatched,
  onRemoveFromWatched,
}) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (isFavorite) {
      onRemoveFromFavorites(movie.id);
    } else {
      onAddToFavorites(movie);
    }
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    if (isWatched) {
      onRemoveFromWatched(movie.id);
    } else {
      onAddToWatched(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-card-image-container">
        <img
          src={
            posterPath
              ? `https://image.tmdb.org/t/p/w500${posterPath}`
              : "/placeholder-poster.png"
          }
          alt={`Poster for ${title}`}
        />
        <div className="movie-card-actions">
          <button
            className={`action-btn favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <button
            className={`action-btn watched-btn ${isWatched ? "active" : ""}`}
            onClick={handleWatchedClick}
            title={isWatched ? "Mark as unwatched" : "Mark as watched"}
          >
            {isWatched ? "✅" : "👁️"}
          </button>
        </div>
      </div>
      <div className="movie-card-content">
        <h3>{title}</h3>
        <p>⭐ {voteAverage}</p>
      </div>
    </div>
  );
}
