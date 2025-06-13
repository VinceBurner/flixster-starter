// src/App.jsx
import React, { useState, useEffect } from "react";
import MovieList from "./components/MovieList";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("nowPlaying");
  const [favorites, setFavorites] = useState([]);
  const [watched, setWatched] = useState([]);

  // Load favorites and watched from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("flixster-favorites");
    const savedWatched = localStorage.getItem("flixster-watched");

    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (savedWatched) {
      setWatched(JSON.parse(savedWatched));
    }
  }, []);

  // Save to localStorage whenever favorites or watched changes
  useEffect(() => {
    localStorage.setItem("flixster-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("flixster-watched", JSON.stringify(watched));
  }, [watched]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      const isAlreadyFavorite = prev.some((fav) => fav.id === movie.id);
      if (isAlreadyFavorite) return prev;
      return [...prev, movie];
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const addToWatched = (movie) => {
    setWatched((prev) => {
      const isAlreadyWatched = prev.some((watched) => watched.id === movie.id);
      if (isAlreadyWatched) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatched = (movieId) => {
    setWatched((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  const clearAllWatched = () => {
    setWatched([]);
  };

  const isMovieFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const isMovieWatched = (movieId) => {
    return watched.some((movie) => movie.id === movieId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <button
            className={`hamburger-menu ${sidebarOpen ? "active" : ""}`}
            onClick={toggleSidebar}
            aria-label="Toggle sidebar menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <h1 className="app-title">Flixster</h1>
          </div>
        </div>
      </header>

      <div className="app-content">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          activeView={currentView}
          onViewChange={handleViewChange}
          favorites={favorites}
          watched={watched}
          onRemoveFromFavorites={removeFromFavorites}
          onRemoveFromWatched={removeFromWatched}
          onClearAllFavorites={clearAllFavorites}
          onClearAllWatched={clearAllWatched}
        />

        <MovieList
          currentView={currentView}
          favorites={favorites}
          watched={watched}
          onAddToFavorites={addToFavorites}
          onRemoveFromFavorites={removeFromFavorites}
          onAddToWatched={addToWatched}
          onRemoveFromWatched={removeFromWatched}
          isMovieFavorite={isMovieFavorite}
          isMovieWatched={isMovieWatched}
          onViewChange={handleViewChange}
        />
      </div>

      <footer className="App-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Flixster</h3>
            <p>Your ultimate movie discovery platform</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Now Playing</li>
              <li>Popular Movies</li>
              <li>Top Rated</li>
              <li>Upcoming</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <span>📱</span>
              <span>🐦</span>
              <span>📘</span>
              <span>📷</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Flixster. All rights reserved. | Powered by TMDB</p>
        </div>
      </footer>
    </div>
  );
}
