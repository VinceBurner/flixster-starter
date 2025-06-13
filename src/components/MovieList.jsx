import React, { useEffect, useState, useRef } from "react";
import MovieCard from "./MovieCard";
import MovieDetails from "./MovieDetails";
import "./MovieList.css";

export default function MovieList({
  currentView,
  favorites,
  watched,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddToWatched,
  onRemoveFromWatched,
  isMovieFavorite,
  isMovieWatched,
}) {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [view, setView] = useState("nowPlaying"); // 'nowPlaying' or 'search'

  // Use currentView from props, fallback to local view for search functionality
  const activeView = currentView || view;
  const [movies, setMovies] = useState([]); // list of movies to render
  const [page, setPage] = useState(1); // current page for pagination
  const [totalPages, setTotalPages] = useState(1); // how many pages are available
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null); // for modal details
  const [sortBy, setSortBy] = useState("popularity.desc"); // default sort option
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filters, setFilters] = useState({
    minRating: 0,
    maxRating: 10,
    genres: [],
  });

  // Genre mapping based on TMDB genre IDs
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  const sortMenuRef = useRef(null);
  const filterMenuRef = useRef(null);

  // Fetch movies whenever view, page, or searchQuery changes
  useEffect(() => {
    // Handle favorites and watched views - no API call needed
    if (activeView === "favorites") {
      setMovies(favorites || []);
      setTotalPages(1);
      return;
    }

    if (activeView === "watched") {
      setMovies(watched || []);
      setTotalPages(1);
      return;
    }

    if (!apiKey) {
      console.error("Missing VITE_API_KEY!");
      return;
    }
    const controller = new AbortController();

    async function fetchMovies() {
      let url;
      if (view === "nowPlaying") {
        url =
          `https://api.themoviedb.org/3/movie/now_playing` +
          `?api_key=${apiKey}&page=${page}`;
      } else {
        url =
          `https://api.themoviedb.org/3/search/movie` +
          `?api_key=${apiKey}` +
          `&query=${encodeURIComponent(searchQuery)}` +
          `&page=${page}`;
      }

      try {
        const res = await fetch(url, { signal: controller.signal });
        const json = await res.json();
        const results = json.results || [];

        // Apply client-side sorting to the results
        const sortedResults = sortMovies(results, sortBy);

        setMovies((prev) => {
          if (page === 1) {
            return sortedResults;
          } else {
            // When loading more pages, we need to sort all movies together
            const allMovies = [...prev, ...sortedResults];
            return sortMovies(allMovies, sortBy);
          }
        });

        setTotalPages(json.total_pages || 1);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      }
    }

    fetchMovies();
    return () => controller.abort();
  }, [apiKey, view, page, searchQuery, activeView, favorites, watched]); // Add activeView, favorites, watched to dependencies

  // Sort options
  const sortOptions = [
    { value: "popularity.desc", label: "Popularity (High to Low)" },
    { value: "popularity.asc", label: "Popularity (Low to High)" },
    { value: "vote_average.desc", label: "Rating (High to Low)" },
    { value: "vote_average.asc", label: "Rating (Low to High)" },
    { value: "release_date.desc", label: "Release Date (Newest)" },
    { value: "release_date.asc", label: "Release Date (Oldest)" },
    { value: "title.asc", label: "Title (A-Z)" },
    { value: "title.desc", label: "Title (Z-A)" },
  ];

  // Function to sort movies based on the selected sort option
  const sortMovies = (moviesToSort, sortOption) => {
    if (!moviesToSort || moviesToSort.length === 0) return [];

    const [field, direction] = sortOption.split(".");
    const multiplier = direction === "asc" ? 1 : -1;

    return [...moviesToSort].sort((a, b) => {
      // Handle null or undefined values
      if (!a[field] && a[field] !== 0) return 1 * multiplier;
      if (!b[field] && b[field] !== 0) return -1 * multiplier;

      // Special handling for dates
      if (field === "release_date") {
        const dateA = a[field] ? new Date(a[field]) : new Date(0);
        const dateB = b[field] ? new Date(b[field]) : new Date(0);
        return (dateA - dateB) * multiplier;
      }

      // Regular number or string comparison
      if (a[field] < b[field]) return -1 * multiplier;
      if (a[field] > b[field]) return 1 * multiplier;
      return 0;
    });
  };

  const handleSortChange = (e) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);

    // Apply the new sort to the existing movies
    setMovies((movies) => sortMovies(movies, newSortBy));
  };

  // ── Handlers ─────────────────────────────────────────
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    if (view === "search") {
      handleViewNowPlaying();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setView("search");
    setPage(1);
  };

  const handleViewNowPlaying = () => {
    if (view !== "nowPlaying") {
      setView("nowPlaying");
      setPage(1);
      setSearchQuery("");
      setMovies([]);
    }
  };

  // Fetch and open details modal
  const handleCardClick = async (movie) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
      );
      const full = await res.json();
      setSelectedMovie(full);
    } catch (err) {
      console.error("Error loading movie details", err);
    }
  };

  const closeDetails = () => setSelectedMovie(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sortMenuRef.current &&
        !sortMenuRef.current.contains(event.target) &&
        !event.target.classList.contains("sort-button")
      ) {
        setShowSortMenu(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target) &&
        !event.target.classList.contains("filter-button")
      ) {
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ── Render ───────────────────────────────────────────
  return (
    <main>
      {/* Controls */}
      <header className="controls">
        <button onClick={handleViewNowPlaying} disabled={view === "nowPlaying"}>
          Now Playing
        </button>

        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search movies…"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <button type="submit" disabled={!searchQuery.trim()}>
            Search
          </button>
          <button
            type="button"
            className="clear-search-btn"
            onClick={handleClearSearch}
            aria-label="Clear search"
            disabled={!searchQuery.trim()}
          >
            Clear
          </button>
        </form>

        <div className="button-controls">
          <div className="dropdown-container">
            <button
              className="control-button sort-button"
              onClick={() => {
                setShowSortMenu(!showSortMenu);
                setShowFilterMenu(false);
              }}
            >
              <span>Sort</span>
              <span className="icon">▼</span>
              {sortBy !== "popularity.desc" && (
                <span className="active-indicator"></span>
              )}
            </button>
            {showSortMenu && (
              <div className="dropdown-menu" ref={sortMenuRef}>
                {sortOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-item ${
                      sortBy === option.value ? "active" : ""
                    }`}
                    onClick={() => {
                      handleSortChange({ target: { value: option.value } });
                      setShowSortMenu(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <button
              className="control-button filter-button"
              onClick={() => {
                setShowFilterMenu(!showFilterMenu);
                setShowSortMenu(false);
              }}
            >
              <span>Filter</span>
              <span className="icon">▼</span>
              {(filters.minRating > 0 ||
                filters.maxRating < 10 ||
                filters.genres.length > 0) && (
                <span className="active-indicator"></span>
              )}
            </button>
            {showFilterMenu && (
              <div className="dropdown-menu filter-menu" ref={filterMenuRef}>
                <div className="filter-section">
                  <h4>Rating</h4>
                  <div className="rating-filter">
                    <div className="rating-inputs">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minRating: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                      <span>to</span>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filters.maxRating}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            maxRating: parseFloat(e.target.value) || 10,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Genres</h4>
                  <div className="genre-filter">
                    {Object.entries(genreMap).map(([id, name]) => (
                      <label key={id} className="genre-checkbox">
                        <input
                          type="checkbox"
                          checked={filters.genres.includes(parseInt(id))}
                          onChange={(e) => {
                            const genreId = parseInt(id);
                            if (e.target.checked) {
                              setFilters({
                                ...filters,
                                genres: [...filters.genres, genreId],
                              });
                            } else {
                              setFilters({
                                ...filters,
                                genres: filters.genres.filter(
                                  (g) => g !== genreId
                                ),
                              });
                            }
                          }}
                        />
                        <span>{name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="filter-actions">
                  <button
                    onClick={() => {
                      // Apply filters (already applied via the filter function)
                      setShowFilterMenu(false);
                    }}
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setFilters({
                        minRating: 0,
                        maxRating: 10,
                        genres: [],
                      });
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Section Title */}
      <h2 className="section-title">
        {activeView === "favorites"
          ? "My Favorites"
          : activeView === "watched"
          ? "Watched Movies"
          : view === "nowPlaying"
          ? "Now Playing"
          : `Search Results for "${searchQuery}"`}
      </h2>

      {/* Movie Grid */}
      <div className="movie-list">
        {movies
          .filter((m) => {
            // Apply rating filter
            const rating = m.vote_average || 0;
            const passesRatingFilter =
              rating >= filters.minRating && rating <= filters.maxRating;

            // Apply genre filter
            const passesGenreFilter =
              filters.genres.length === 0 ||
              filters.genres.some((genreId) => m.genre_ids?.includes(genreId));

            return passesRatingFilter && passesGenreFilter;
          })
          .map((m) => (
            <div
              key={m.id}
              onClick={() => handleCardClick(m)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard
                title={m.title}
                posterPath={m.poster_path}
                voteAverage={m.vote_average}
                movie={m}
                isFavorite={isMovieFavorite && isMovieFavorite(m.id)}
                isWatched={isMovieWatched && isMovieWatched(m.id)}
                onAddToFavorites={onAddToFavorites}
                onRemoveFromFavorites={onRemoveFromFavorites}
                onAddToWatched={onAddToWatched}
                onRemoveFromWatched={onRemoveFromWatched}
              />
            </div>
          ))}
      </div>

      {/* No movies message */}
      {movies.length === 0 && (
        <p className="no-movies">No movies to display.</p>
      )}

      {/* Load More */}
      {view === "nowPlaying" && page < totalPages && movies.length > 0 && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}

      {}
      {selectedMovie && (
        <MovieDetails movie={selectedMovie} onClose={closeDetails} />
      )}
    </main>
  );
}
