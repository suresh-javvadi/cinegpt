import { useCallback } from "react";

const KEY = "cg_recently_viewed";
const MAX = 10;

export const addRecentlyViewed = (movie) => {
  if (!movie?.id || !movie?.poster_path) return;
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const filtered = stored.filter((m) => m.id !== movie.id);
    const entry = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    };
    const updated = [entry, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

export const removeRecentlyViewed = (id) => {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    localStorage.setItem(KEY, JSON.stringify(stored.filter((m) => m.id !== id)));
  } catch {}
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};
