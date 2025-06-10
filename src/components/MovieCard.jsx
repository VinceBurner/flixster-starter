import React from 'react';
import './MovieCard.css';

export default function MovieCard({ title, posterPath, voteAverage }) {
  return (
    <div className="movie-card">
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={`Poster for ${title}`}
      />
      <h3>{title}</h3>
      <p>⭐ {voteAverage}</p>
    </div>
  );
}
