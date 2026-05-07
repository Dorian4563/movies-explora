import { type FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchMovies } from "../services/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const navigate = useNavigate();
  const query = useQuery().get("q") ?? "";
  const [movies, setMovies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(query);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(query);
    if (!query) {
      setMovies([]);
      return;
    }

    let active = true;

    const loadResults = async () => {
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

    loadResults();

    return () => {
      active = false;
    };
  }, [query]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelectFilter = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleNotificationClick = () => {
    setNotificationsOpen((current) => !current);
  };

  return (
    <main className="search-page">
      <header className="hero-nav search-nav">
        <div className="hero-brand">Dorian movies explorer</div>
        <nav className="hero-menu">
          <button onClick={() => navigate("/")} className="nav-btn">Home</button>
          <button onClick={() => navigate("/")} className="nav-btn">TV Shows</button>
          <button onClick={() => navigate("/")} className="nav-btn">Movies</button>
          <button onClick={() => navigate("/watchlist")} className="nav-btn">My List</button>
        </nav>

        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchTerm}
            placeholder="Search movies, TV shows..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <div className="hero-actions-right">
          <button className="icon-btn" type="button" onClick={handleNotificationClick}>
            🔔
          </button>
          <button className="profile-pill" onClick={() => navigate("/watchlist")}>My List</button>
          {notificationsOpen && (
            <div className="notification-dropdown">
              <p className="notification-title">Notifications</p>
              <p>Your watchlist has fresh recommendations.</p>
            </div>
          )}
        </div>
      </header>

      <section className="search-header">
        <div>
          <span className="search-label">Search results for</span>
          <h1>{query ? query : "Start a search"}</h1>
          {query && (
            <p className="search-summary">
              Showing {movies.length} result{movies.length === 1 ? "" : "s"} for "{query}"
            </p>
          )}
        </div>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchTerm}
            placeholder="Search movies, TV shows..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>
      </section>

      <div className="filter-row">
        {[
          { label: "All", value: "All" },
          { label: "Movies", value: "Movies" },
          { label: "TV Shows", value: "TV Shows" },
          { label: "Persons", value: "Persons" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-pill ${selectedFilter === option.value ? "active" : ""}`}
            onClick={() => handleSelectFilter(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && <p className="error-banner">{error}</p>}

      <section className="section-row">
        <div className="row-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
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
            <div className="card-empty">
              {query ? "No results found." : "Enter a movie name above to search."}
            </div>
          )}
        </div>
      </section>

      {movies.length > 0 && (
        <div className="search-footer">
          <p>Showing {movies.length} of {movies.length} results</p>
          <button className="hero-btn hero-btn-secondary" type="button">
            Explore More Results
          </button>
        </div>
      )}
    </main>
  );
}
