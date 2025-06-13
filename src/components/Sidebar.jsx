import React from "react";
import "./Sidebar.css";

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange,
  favorites,
  watched,
  onRemoveFromFavorites,
  onRemoveFromWatched,
  onClearAllFavorites,
  onClearAllWatched,
}) {
  const handleViewChange = (view) => {
    onViewChange(view);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <h2>My Lists</h2>
          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`sidebar-nav-item ${
              activeView === "nowPlaying" ? "active" : ""
            }`}
            onClick={() => handleViewChange("nowPlaying")}
          >
            <span className="nav-icon">🎬</span>
            Now Playing
          </button>

          <button
            className={`sidebar-nav-item ${
              activeView === "favorites" ? "active" : ""
            }`}
            onClick={() => handleViewChange("favorites")}
          >
            <span className="nav-icon">❤️</span>
            Favorites
            <span className="nav-count">{favorites.length}</span>
          </button>

          <button
            className={`sidebar-nav-item ${
              activeView === "watched" ? "active" : ""
            }`}
            onClick={() => handleViewChange("watched")}
          >
            <span className="nav-icon">✅</span>
            Watched
            <span className="nav-count">{watched.length}</span>
          </button>
        </nav>

        {/* Favorites List */}
        {activeView === "favorites" && (
          <div className="sidebar-list">
            <div className="list-header">
              <h3>Favorite Movies</h3>
              {favorites.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={onClearAllFavorites}
                  title="Clear all favorites"
                >
                  Clear All
                </button>
              )}
            </div>
            {favorites.length === 0 ? (
              <p className="empty-list">No favorite movies yet</p>
            ) : (
              <div className="movie-items">
                {favorites.map((movie) => (
                  <div key={movie.id} className="movie-item">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : "/placeholder-poster.png"
                      }
                      alt={movie.title}
                      className="movie-item-poster"
                    />
                    <div className="movie-item-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.release_date?.split("-")[0] || "N/A"}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveFromFavorites(movie.id)}
                      title="Remove from favorites"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Watched List */}
        {activeView === "watched" && (
          <div className="sidebar-list">
            <div className="list-header">
              <h3>Watched Movies</h3>
              {watched.length > 0 && (
                <button
                  className="clear-all-btn"
                  onClick={onClearAllWatched}
                  title="Clear all watched"
                >
                  Clear All
                </button>
              )}
            </div>
            {watched.length === 0 ? (
              <p className="empty-list">No watched movies yet</p>
            ) : (
              <div className="movie-items">
                {watched.map((movie) => (
                  <div key={movie.id} className="movie-item">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                          : "/placeholder-poster.png"
                      }
                      alt={movie.title}
                      className="movie-item-poster"
                    />
                    <div className="movie-item-info">
                      <h4>{movie.title}</h4>
                      <p>{movie.release_date?.split("-")[0] || "N/A"}</p>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveFromWatched(movie.id)}
                      title="Remove from watched"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
