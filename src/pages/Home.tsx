import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies } from "../services/api";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      setError("");

      try {
        const results = await fetchMovies(query);
        if (active) {
          setMovies(results ?? []);
        }
      } catch (err) {
        if (active) {
          setMovies([]);
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    loadMovies();

    return () => {
      active = false;
    };
  }, [query]);

  const heroMovie = movies[0] ?? null;
  const trending = movies.slice(0, 6);
  const popular = movies.slice(6, 12);
  const newReleases = movies.slice(12, 18);

  const renderCarousel = (title: string, items: any[], id?: string) => (
    <section className="section-row" id={id}>
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="row-grid">
        {items.length > 0 ? (
          items.map((movie) => (
            <button
              key={movie.id}
              className="card-button"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="card-overlay">
                <p>{movie.title}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="card-empty">No movies available.</div>
        )}
      </div>
    </section>
  );

  return (
    <main className="homepage">
      <header className="hero-nav">
        <div className="brand">Movie Explorer</div>
        <nav className="hero-menu">
          <a href="#home">Home</a>
          <a href="#trending">TV Shows</a>
          <a href="#popular">Movies</a>
          <a href="#my-list">My List</a>
        </nav>
        <button className="profile-pill">My List</button>
      </header>

      <section className="hero-section" id="home">
        <div
          className="hero-banner"
          style={{
            backgroundImage: heroMovie
              ? `linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.95) 60%), url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path || heroMovie.poster_path})`
              : "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.95) 60%, rgba(0,0,0,1) 100%)",
          }}
        >
          <div className="hero-copy">
            <span className="eyebrow">CINEMA NOIR ORIGINAL</span>
            <h1>{heroMovie?.title || "Discover new movies"}</h1>
            <p>
              {heroMovie?.overview ||
                "Browse trending films, watchlist picks, and the latest releases in a cinematic style."}
            </p>
            <div className="hero-actions">
              <button
                className="hero-btn hero-btn-primary"
                onClick={() => heroMovie && navigate(`/movie/${heroMovie.id}`)}
              >
                Play
              </button>
              <button
                className="hero-btn hero-btn-secondary"
                onClick={() => heroMovie && navigate(`/movie/${heroMovie.id}`)}
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="search-panel">
        <div className="search-pill">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            value={query}
            placeholder="Search movies..."
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {error && <p className="error-banner">{error}</p>}
      </section>

      {renderCarousel("Trending Now", trending, "trending")}
      {renderCarousel("Popular on Cinema Noir", popular, "popular")}
      {renderCarousel("New Releases", newReleases)}
    </main>
  );
}
