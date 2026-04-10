import { createContext, useContext, useEffect, useState } from "react";

export const WatchlistContext = createContext<any>(null);

export const WatchlistProvider = ({ children }: any) => {
  const [watchlist, setWatchlist] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(stored);
  }, []);

  const toggleWatchlist = (movie: any) => {
    const exists = watchlist.find((m) => m.id === movie.id);

    let updated;

    if (exists) {
      updated = watchlist.filter((m) => m.id !== movie.id);
    } else {
      updated = [...watchlist, movie];
    }

    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export function useWatchlist() {
  return useContext(WatchlistContext);
}