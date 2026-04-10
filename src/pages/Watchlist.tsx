import { useWatchlist } from "../context/WatchlistContext";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="watchlist-page">
      <Navbar />

      <div className="watchlist-container">
        <h1 className="page-title">My Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="empty-state">
            <p>❤️ No movies saved yet</p>
            <p className="empty-hint">Start adding movies to your watchlist!</p>
          </div>
        ) : (
          <div className="watchlist-grid">
            {watchlist.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}