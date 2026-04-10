import { useNavigate } from "react-router-dom";
import { useWatchlist } from "../context/WatchlistContext";

export default function MovieCard({ movie }: any) {
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();

  const isSaved = watchlist.find((m: any) => m.id === movie.id);

  return (
    <div className="movie-card">

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        onClick={() => navigate(`/movie/${movie.id}`)}
      />

      <button onClick={() => toggleWatchlist(movie)}>
        {isSaved ? "❤️" : "🤍"}
      </button>

      <h3>{movie.title}</h3>
      <p>{movie.release_date?.split("-")[0]}</p>
      <p>⭐ {movie.vote_average}</p>
    </div>
  );
}