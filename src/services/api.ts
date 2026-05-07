const API_KEY = import.meta.env.VITE_TMDB_API_KEY ?? "";
const BASE_URL = "https://api.themoviedb.org/3";

const getApiKey = () => {
  if (!API_KEY || API_KEY === "YOUR_API_KEY") {
    throw new Error(
      "Missing TMDB API key. Add VITE_TMDB_API_KEY to a .env file and restart Vite."
    );
  }
  return API_KEY;
};

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data?.status_message || res.statusText;
    throw new Error(`TMDB request failed (${res.status}): ${errorMessage}`);
  }

  return data;
};

export const fetchMovies = async (query = "") => {
  const apiKey = getApiKey();
  const url = query
    ? `${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    : `${BASE_URL}/movie/popular?api_key=${apiKey}`;

  const data = await fetchJson(url);
  return data.results ?? [];
};

export const fetchTVShows = async (query = "") => {
  const apiKey = getApiKey();
  const url = query
    ? `${BASE_URL}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    : `${BASE_URL}/tv/popular?api_key=${apiKey}`;

  const data = await fetchJson(url);
  return data.results ?? [];
};

export const fetchMovieDetails = async (id: string) => {
  const apiKey = getApiKey();
  const data = await fetchJson(
    `${BASE_URL}/movie/${encodeURIComponent(id)}?api_key=${apiKey}`
  );

  return data;
};

export const fetchTVDetails = async (id: string) => {
  const apiKey = getApiKey();
  const data = await fetchJson(
    `${BASE_URL}/tv/${encodeURIComponent(id)}?api_key=${apiKey}`
  );

  return data;
};
