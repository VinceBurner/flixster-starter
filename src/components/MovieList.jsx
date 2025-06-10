import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieList.css';

export default function MovieList() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [view, setView] = useState('nowPlaying');      // 'nowPlaying' or 'search'
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch whenever view, page, or query changes
  useEffect(() => {
    if (!apiKey) return console.error('Missing VITE_TMDB_API_KEY!');
    const controller = new AbortController();

    async function fetchMovies() {
      let url;
      if (view === 'nowPlaying') {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`
            + `&query=${encodeURIComponent(searchQuery)}&page=${page}`;
      }

      try {
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const results = json.results || [];
        // if first page, replace; otherwise append
        setMovies((prev) => (page === 1 ? results : [...prev, ...results]));
        setTotalPages(json.total_pages || 1);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }

    fetchMovies();
    return () => controller.abort();
  }, [apiKey, view, page, searchQuery]);

  // Handlers
  const handleLoadMore = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setView('search');
    setPage(1);
  };

  const handleViewNowPlaying = () => {
    if (view !== 'nowPlaying') {
      setView('nowPlaying');
      setPage(1);
      setSearchQuery('');
    }
  };

  return (
    <main>
      <header className="controls">
        <button
          onClick={handleViewNowPlaying}
          disabled={view === 'nowPlaying'}
        >
          Now Playing
        </button>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search movies…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" disabled={!searchQuery.trim()}>
            Search
          </button>
        </form>
      </header>

      <h2 className="section-title">
        {view === 'nowPlaying'
          ? 'Now Playing'
          : `Search Results for "${searchQuery}"`}
      </h2>

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

      {movies.length === 0 && (
        <p className="no-movies">No movies to display.</p>
      )}

      {page < totalPages && movies.length > 0 && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </main>
  );
}
