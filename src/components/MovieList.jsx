

import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import MovieDetails from './MovieDetails';
import './MovieList.css';


export default function MovieList() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  
  const [view, setView] = useState('nowPlaying');    // 'nowPlaying' or 'search'
  const [movies, setMovies] = useState([]);          // list of movies to render
  const [page, setPage] = useState(1);               // current page for pagination
  const [totalPages, setTotalPages] = useState(1);   // how many pages are available
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedMovie, setSelectedMovie] = useState(null); // for modal details

  // Fetch movies whenever view, page, or searchQuery changes 
  useEffect(() => {
    if (!apiKey) {
      console.error('Missing VITE_TMDB_API_KEY!');
      return;
    }
    const controller = new AbortController();

    async function fetchMovies() {
      let url;
      if (view === 'nowPlaying') {
        url = `https://api.themoviedb.org/3/movie/now_playing`
            + `?api_key=${apiKey}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/search/movie`
            + `?api_key=${apiKey}`
            + `&query=${encodeURIComponent(searchQuery)}`
            + `&page=${page}`;
      }

      try {
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const results = json.results || [];
        setMovies(prev =>
          page === 1 ? results : [...prev, ...results]
        );
        setTotalPages(json.total_pages || 1);
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    }

    fetchMovies();
    return () => controller.abort();
  }, [apiKey, view, page, searchQuery]);

  // ── Handlers ─────────────────────────────────────────
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = e => {
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
      setMovies([]);
    }
  };

  // Fetch and open details modal
  const handleCardClick = async movie => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
      );
      const full = await res.json();
      setSelectedMovie(full);
    } catch (err) {
      console.error('Error loading movie details', err);
    }
  };

  const closeDetails = () => setSelectedMovie(null);

  // ── Render ───────────────────────────────────────────
  return (
    <main>
      {/* Controls */}
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
            onChange={handleSearchChange}
          />
          <button type="submit" disabled={!searchQuery.trim()}>
            Search
          </button>
        </form>
      </header>

      {/* Section Title */}
      <h2 className="section-title">
        {view === 'nowPlaying'
          ? 'Now Playing'
          : `Search Results for “${searchQuery}”`}
      </h2>

      {/* Movie Grid */}
      <div className="movie-list">
        {movies.map(m => (
          <div
            key={m.id}
            onClick={() => handleCardClick(m)}
            style={{ cursor: 'pointer' }}
          >
            <MovieCard
              title={m.title}
              posterPath={m.poster_path}
              voteAverage={m.vote_average}
            />
          </div>
        ))}
      </div>

      {/* No movies message */}
      {movies.length === 0 && (
        <p className="no-movies">No movies to display.</p>
      )}

      {/* Load More */}
      {view === 'nowPlaying' && page < totalPages && movies.length > 0 && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={closeDetails} />
      )}
    </main>
  );
}
