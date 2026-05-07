import useWatchlist from "../context/WatchlistContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <div className="watchlist-page">
      <Navbar />

      <div className="watchlist-container">
        <h1 className="page-title">My List</h1>
        <p className="watchlist-subtitle">{watchlist.length} TITLES SAVED</p>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            <p>❤️ No movies saved yet</p>
            <p className="empty-hint">Start adding movies to your watchlist!</p>
          </div>
        ) : (
          <>
            <div className="watchlist-grid">
              {watchlist.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div className="want-more-section">
              <h2>Want to see more?</h2>
              <p>Explore the latest trending titles and add them to your list<br />to watch whenever you want.</p>
              <button className="explore-btn" onClick={() => navigate("/")}>
                Explore Trending
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}