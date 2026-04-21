import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies, fetchTVShows } from "../services/api";

export default function Home() {
  const [content, setContent] = useState<any[]>([]);
  const [contentType, setContentType] = useState<'movies' | 'tv'>('movies');
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      setError("");

      try {
        const results = contentType === 'movies' ? await fetchMovies() : await fetchTVShows();
        if (active) {
          setContent(results ?? []);
        }
      } catch (err) {
        if (active) {
          setContent([]);
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, [contentType]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleNotificationClick = () => {
    setNotificationsOpen((current) => !current);
  };

  const handleContentTypeChange = (type: 'movies' | 'tv') => {
    setContentType(type);
  };

  const heroItem = content[0] ?? null;
  const trending = content.slice(0, 6);
  const popular = content.slice(6, 12);
  const newReleases = content.slice(12, 18);

  const renderCarousel = (title: string, items: any[], id?: string) => (
    <section className="section-row" id={id}>
      <div className="section-header">
        <h2>{title}</h2>
      </div>
      <div className="row-grid">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.id}
              className="card-button"
              onClick={() => navigate(`/${contentType === 'movies' ? 'movie' : 'tv'}/${item.id}`)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
              />
              <div className="card-overlay">
                <p>{item.title || item.name}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="card-empty">No content available.</div>
        )}
      </div>
    </section>
  );

  return (
    <main className="homepage">
      <header className="hero-nav">
        <div className="hero-brand">Dorian movies explorer</div>
        <nav className="hero-menu">
          <button onClick={() => handleContentTypeChange('movies')} className="nav-btn">Home</button>
          <button onClick={() => handleContentTypeChange('tv')} className="nav-btn">TV Shows</button>
          <button onClick={() => handleContentTypeChange('movies')} className="nav-btn">Movies</button>
          <button onClick={() => navigate("/watchlist")} className="nav-btn">My List</button>
        </nav>

        <form className="nav-search" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchTerm}
            placeholder="Search Inception, Batman..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>

        <div className="hero-actions-right">
          <button className="icon-btn" type="button" onClick={handleNotificationClick}>
            notifications
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

      <section className="hero-section" id="home">
        <div
          className="hero-banner"
          style={{
            backgroundImage: heroItem
              ? `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path || heroItem.poster_path})`
              : "none",
          }}
        >
          <div className="hero-copy">
            <span className="eyebrow">CINEMA NOIR ORIGINAL</span>
            <h1>{heroItem?.title || heroItem?.name || "Discover new content"}</h1>
            <p>
              {heroItem?.overview ||
                `Browse trending ${contentType === 'movies' ? 'films' : 'shows'}, watchlist picks, and the latest releases in a cinematic style.`}
            </p>
            <div className="hero-actions">
              <button
                className="hero-btn hero-btn-primary"
                onClick={() => heroItem && navigate(`/${contentType === 'movies' ? 'movie' : 'tv'}/${heroItem.id}`)}
              >
                Play
              </button>
              <button
                className="hero-btn hero-btn-secondary"
                onClick={() => heroItem && navigate(`/${contentType === 'movies' ? 'movie' : 'tv'}/${heroItem.id}`)}
              >
                More Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {renderCarousel("Trending Now", trending, "trending")}
      {renderCarousel("Popular on Cinema Noir", popular, "popular")}
      {renderCarousel("New Releases", newReleases)}
    </main>
  );
}
