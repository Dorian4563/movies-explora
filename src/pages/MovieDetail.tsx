import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/api";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useWatchlist } from "../context/WatchlistContext";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isSaved = movie ? watchlist.find((m: any) => m.id === movie.id) : false;

  useEffect(() => {
    setLoading(true);
    fetchMovieDetails(id!)
      .then((data) => {
        setMovie(data);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load movie");
        setMovie(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="movie-detail-page">
      <Navbar />

      {loading && <Loader />}

      {error && <div className="error-message">{error}</div>}

      {movie && (
        <motion.div
          className="detail-content"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="detail-buttons">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <button
              className={`watchlist-btn ${isSaved ? "saved" : ""}`}
              onClick={() => movie && toggleWatchlist(movie)}
            >
              {isSaved ? (
                <>
                  <span className="btn-icon">❤️</span>
                  Remove from List
                </>
              ) : (
                <>
                  <span className="btn-icon">🤍</span>
                  Add to My List
                </>
              )}
            </button>
          </div>

          <div className="detail-header">
            <img
              className="detail-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />

            <div className="detail-info">
              <h1>{movie.title}</h1>
              <p className="release-date">Release Date: {movie.release_date}</p>
              <p className="rating">⭐ {movie.vote_average?.toFixed(1)} / 10</p>
              <p className="genres">
                Genres: {movie.genres?.map((g: any) => g.name).join(", ") || "N/A"}
              </p>
              <p className="overview">{movie.overview}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
