// src/App.jsx
import React from "react";
import MovieList from "./components/MovieList";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🎬</span>
            <h1 className="app-title">Flixster</h1>
          </div>
          <nav className="nav-links">
            <span className="nav-item">Movies</span>
            <span className="nav-item">Trending</span>
            <span className="nav-item">Favorites</span>
          </nav>
        </div>
      </header>
      <MovieList />
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
