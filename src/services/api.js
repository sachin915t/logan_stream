import axios from "axios";

const BASE_URL = import.meta.env.VITE_LOGANSTREAM_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;

/* -------- API CALLS -------- */

// Latest Movies
export const getLatest = () =>
  api.get("/latest");

// Top 100 Movies
export const getTop100 = () =>
  api.get("/top100");

// Top 100 TV
export const getTopTV = () =>
  api.get("/tv/top100");

// AI Search
export const aiSearch = (message) =>
  api.post("/ai-search", {
    message,
  });

// Search Movies / TV / Anime
export const searchMedia = (query, type) =>
  api.get("/search", {
    params: {
      query,
      type,
    },
  });

// Movie Details
export const fetchMovieDetails = (id) =>
  api.get(`/movie/${id}`);

// Movies by Genre
export const getByGenre = (genreId) =>
  api.get(`/genre/${genreId}`);

// Latest TV
export const getLatestTV = () =>
  api.get("/tv/latest");

// TV by Genre
export const getTVByGenre = (genreId) =>
  api.get(`/tv/genre/${genreId}`);

// TV Details
export const fetchTVDetails = (id) =>
  api.get(`/tv/${id}`);

// Movie Recommendations
export const fetchRecommendations = (id) =>
  api.get(`/movie/${id}/recommendations`);

// TV Recommendations
export const fetchTVRecommendations = (id) =>
  api.get(`/tv/${id}/recommendations`);

// Movie / TV Logo
export const fetchMediaLogo = (id, type = "movie") =>
  api.get(`/${type}/${id}/images`);

// Top Anime
export const getTopAnime = () =>
  api.get("/top-anime");

// Anime Details
export const fetchAnimeDetails = (id) =>
  api.get(`/tv/${id}`);

// Discover Movies / TV / Anime
export const discoverMedia = (type, params) =>
  api.get(`/${type}/discover`, {
    params,
  });