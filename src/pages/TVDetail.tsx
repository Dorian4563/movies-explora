import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTVDetails } from "../services/api";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { useWatchlist } from "../context/WatchlistContext";

export default function TVDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { watchlist, toggleWatchlist } = useWatchlist();
  const [tv, setTV] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isSaved = tv ? watchlist.find((m: any) => m.id === tv.id) : false;

  useEffect(() => {
    setLoading(true);
    fetchTVDetails(id!)
      .then((data) => {
        setTV(data);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load TV show");
        setTV(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="movie-detail-page">
      <Navbar />

      {loading && <Loader />}

      {error && <div className="error-message">{error}</div>}

      {tv && (
        <motion.section
          className="detail-hero"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div
            className="detail-hero-backdrop"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${tv.backdrop_path || tv.poster_path})`,
            }}
          />

          <div className="detail-hero-body detail-content">
            <button className="back-btn hero-back" onClick={() => navigate(-1)}>
              ← Back
            </button>

            <div className="detail-poster-wrapper">
              <img
                className="detail-poster"
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
              />
            </div>

            <div className="detail-info">
              <p className="detail-tagline">{tv.tagline || "Top pick for you"}</p>
              <h1>{tv.name}</h1>
              <div className="detail-meta-row">
                <span>{tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A'}</span>
                <span>⭐ {tv.vote_average?.toFixed(1)}</span>
                <span>{tv.number_of_seasons ? `${tv.number_of_seasons} Season${tv.number_of_seasons > 1 ? 's' : ''}` : "N/A"}</span>
                <span>{tv.original_language?.toUpperCase()}</span>
              </div>

              <div className="detail-actions">
                <button
                  className="hero-btn hero-btn-primary"
                  onClick={() => navigate(`/tv/${tv.id}`)}
                >
                  Play
                </button>
                <button
                  className={`hero-btn hero-btn-secondary ${isSaved ? "saved" : ""}`}
                  onClick={() => tv && toggleWatchlist(tv)}
                >
                  {isSaved ? "Remove from List" : "Add to My List"}
                </button>
              </div>

              <p className="genres">
                {tv.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
              </p>
              <p className="overview">{tv.overview}</p>
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}