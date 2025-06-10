import React from 'react';
import MovieCard from './MovieCard';
import data from '../data/data';     // ← import your static data
import './MovieList.css';

export default function MovieList() {
  const movies = data.results || [];

  return (
    <main>
      <h2>Now Playing (static)</h2>

      <div className="movie-list">
        {movies.map((m) => (
          <MovieCard
            key={m.id}
            title={m.title}
            posterPath={m.poster_path}
            voteAverage={m.vote_average}
          />
        ))}
      </div>
    </main>
  );
}
