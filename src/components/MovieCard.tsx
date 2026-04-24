import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";

export default function MovieCard({ movie }: any) {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const isSaved = watchlist.find((m: any) => m.id === movie.id);

  return (
    <div className="movie-card">
      <div className="card-image-container">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          onClick={() => navigate(`/movie/${movie.id}`)}
        />
        <button 
          className={`card-toggle-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWatchlist(movie);
          }}
          title={isSaved ? "Remove from List" : "Add to My List"}
        >
          {isSaved ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="card-content">
        <h3 onClick={() => navigate(`/movie/${movie.id}`)}>{movie.title}</h3>
        <div className="card-meta">
          <span>{movie.release_date?.split("-")[0]}</span>
          <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          <span>{movie.runtime ? `${movie.runtime}m` : "N/A"}</span>
          <span>{movie.original_language?.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}