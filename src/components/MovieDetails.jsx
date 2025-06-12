import React, { useState, useEffect } from "react";
import "./MovieDetails.css";

export default function MovieDetails({ movie, onClose }) {
  const [trailerData, setTrailerData] = useState(null);
  const [trailerError, setTrailerError] = useState(false);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(true);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (!movie?.id || !apiKey) return;

    const fetchTrailer = async () => {
      try {
        setIsLoadingTrailer(true);
        setTrailerError(false);

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${apiKey}`
        );
        const data = await response.json();

        // Find the first YouTube trailer or teaser
        const trailer = data.results?.find(
          (video) =>
            video.site === "YouTube" &&
            (video.type === "Trailer" || video.type === "Teaser")
        );

        if (trailer) {
          setTrailerData(trailer);
        } else {
          setTrailerError(true);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
        setTrailerError(true);
      } finally {
        setIsLoadingTrailer(false);
      }
    };

    fetchTrailer();
  }, [movie?.id, apiKey]);

  if (!movie) return null;

  const {
    title,
    runtime,
    release_date,
    vote_average,
    backdrop_path,
    genres = [],
    overview,
    production_companies = [],
    spoken_languages = [],
  } = movie;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatRating = (rating) => {
    return rating ? `${rating.toFixed(1)}/10` : "N/A";
  };

  const TrailerSection = () => {
    if (isLoadingTrailer) {
      return (
        <div className="trailer-section">
          <h3>🎬 Trailer</h3>
          <div className="trailer-placeholder loading">
            <div className="loading-spinner"></div>
            <p>Loading trailer...</p>
          </div>
        </div>
      );
    }

    if (trailerError || !trailerData) {
      return (
        <div className="trailer-section">
          <h3>🎬 Media</h3>
          <div className="trailer-placeholder no-trailer">
            <div className="no-trailer-content">
              <span className="no-trailer-icon">🎭</span>
              <h4>No Trailer Available</h4>
              <p>Check out the movie details and poster instead!</p>
              {backdrop_path && (
                <div className="alternative-media">
                  <p>
                    <strong>Featured Image:</strong>
                  </p>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${backdrop_path}`}
                    alt={`${title} backdrop`}
                    className="fallback-image"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="trailer-section">
        <h3>🎬 Official Trailer</h3>
        <div className="trailer-container">
          <iframe
            src={`https://www.youtube.com/embed/${trailerData.key}?rel=0&modestbranding=1`}
            title={`${title} - ${trailerData.name}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="movie-header">
          {backdrop_path && (
            <img
              className="backdrop"
              src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
              alt={`Backdrop for ${title}`}
            />
          )}
          <div className="movie-title-section">
            <h2>{title}</h2>
            <div className="movie-meta">
              <span className="rating">⭐ {formatRating(vote_average)}</span>
              <span className="runtime">🕐 {formatRuntime(runtime)}</span>
              <span className="release-date">📅 {release_date || "TBA"}</span>
            </div>
          </div>
        </div>

        <TrailerSection />

        <div className="movie-details">
          {genres.length > 0 && (
            <div className="detail-section">
              <h3>🎭 Genres</h3>
              <div className="genre-tags">
                {genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {overview && (
            <div className="detail-section">
              <h3>📖 Overview</h3>
              <p className="overview">{overview}</p>
            </div>
          )}

          {production_companies.length > 0 && (
            <div className="detail-section">
              <h3>🏢 Production</h3>
              <p>
                {production_companies.map((company) => company.name).join(", ")}
              </p>
            </div>
          )}

          {spoken_languages.length > 0 && (
            <div className="detail-section">
              <h3>🌍 Languages</h3>
              <p>
                {spoken_languages.map((lang) => lang.english_name).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
