import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import TVDetail from "./pages/TVDetail";
import Watchlist from "./pages/Watchlist";
import SearchResults from "./pages/SearchResults";
import { WatchlistProvider } from "./context/WatchlistContext";

export default function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/tv/:id" element={<TVDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          
        </Routes>
      </BrowserRouter>
    </WatchlistProvider>
  );
}