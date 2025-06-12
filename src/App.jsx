// src/App.jsx
import React from "react";
import MovieList from "./components/MovieList";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">🎬</span>
            Flixster
            <span className="title-subtitle">Discover Amazing Movies</span>
          </h1>
        </div>
      </header>
      <MovieList />
    </div>
  );
}
