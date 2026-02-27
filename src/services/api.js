import axios from "axios";

const BASE_URL = import.meta.env.VITE_LOGANSTREAM_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

let setGlobalLoading = null;

// This will be connected from App.jsx
export const attachLoadingSetter = (setter) => {
  setGlobalLoading = setter;
};



// Request interceptor
api.interceptors.request.use((config) => {
  if (setGlobalLoading) setGlobalLoading(true);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (setGlobalLoading) setGlobalLoading(false);
    return response;
  },
  (error) => {
    if (setGlobalLoading) setGlobalLoading(false);
    return Promise.reject(error);
  }
);

export default api;

/* -------- API CALLS -------- */

export const getLatest = () => api.get("/latest");

export const getTop100 = () => api.get("/top100");
export const getTopTV = () => api.get("/tv/top100");

export const searchMedia = (query, type) =>
  api.get("/search", {
    params: { query, type },
  });

export const fetchMovieDetails = (id) =>
  api.get(`/movie/${id}`);

export const getByGenre = (genreId) =>
  api.get(`/genre/${genreId}`);

export const getLatestTV = () =>
  api.get("/tv/latest");

export const getTVByGenre = (genreId) =>
  api.get(`/tv/genre/${genreId}`);

export const fetchTVDetails = (id) =>
    api.get(`/tv/${id}`);

