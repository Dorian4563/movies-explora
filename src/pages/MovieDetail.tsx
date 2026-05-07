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
        <motion.section
          className="detail-hero"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="detail-hero-backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})`,
            }}
          />

          <div className="detail-hero-body detail-content">
            <button className="back-btn hero-back" onClick={() => navigate(-1)}>
              Back
            </button>

            <div className="detail-poster-wrapper">
              <img
                className="detail-poster"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            </div>

            <div className="detail-info">
              <p className="detail-tagline">{movie.tagline || "Top pick for you"}</p>
              <h1>{movie.title}</h1>
              <div className="detail-meta-row">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span>{movie.runtime ? `${movie.runtime}m` : "N/A"}</span>
                <span>{movie.original_language?.toUpperCase()}</span>
              </div>

              <div className="detail-actions">
                <button
                  className="hero-btn hero-btn-primary"
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  Play
                </button>
                <button
                  className={`hero-btn hero-btn-secondary ${isSaved ? "saved" : ""}`}
                  onClick={() => movie && toggleWatchlist(movie)}
                >
                  {isSaved ? "Remove from List" : "Add to My List"}
                </button>
              </div>

              <p className="genres">
                {movie.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
              </p>
              <p className="overview">{movie.overview}</p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
