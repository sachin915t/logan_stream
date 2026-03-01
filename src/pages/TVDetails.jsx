import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTVDetails,
  fetchTVRecommendations,
  fetchMediaLogo,
} from "../services/api";
import StreamingBox from "../components/StreamingBox";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function TVDetails() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  // 🔥 TV Details
  const {
    data: detailsData,
    isLoading: detailsLoading,
  } = useQuery({
    queryKey: ["tv-details", id],
    queryFn: async () => {
      const res = await fetchTVDetails(id);
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 Recommendations
  const {
    data: recommendations = [],
    isLoading: recLoading,
  } = useQuery({
    queryKey: ["tv-recommendations", id],
    queryFn: async () => {
      const res = await fetchTVRecommendations(id);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 Logo
  const { data: logo } = useQuery({
    queryKey: ["tv-logo", id],
    queryFn: async () => {
      const res = await fetchMediaLogo(id, "tv");
      return res.data.logos?.[0]?.file_path || null;
    },
    staleTime: 1000 * 60 * 60,
  });

  if (detailsLoading || !detailsData) {
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        {/* <span className="loading loading-spinner loading-lg text-warning"></span> */}
      </div>
    );
  }

  const details = detailsData.details;
  const credits = detailsData.credits;
  const favorite = isFavorite(details.id);
  const cast = credits?.cast?.slice(0, 8) || [];
  const seasonsData = details.seasons || [];
  const currentSeason = seasonsData.find((s) => s.season_number === season);
  const totalEpisodes = currentSeason?.episode_count || 1;

  return (
    <div className="relative min-h-screen w-screen text-white overflow-x-hidden">

      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="fixed inset-0 -z-20">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt="Backdrop"
            className="w-full h-full object-cover blur-sm scale-110 brightness-50"
          />
        </div>
      )}

      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      <div className="relative px-6 md:px-12 py-20 max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
<div className="hover-3d">
          <div className="relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.name}
              className="w-56 md:w-72 rounded-2xl shadow-2xl"
            />
</div>
            {/* Favorite Button */}
            <button
              onClick={() =>
                toggleFavorite({
                  id: details.id,
                  title: details.name,
                  poster_path: details.poster_path,
                  vote_average: details.vote_average,
                  type: "tv",
                })
              }
              className="absolute top-2 left-2 backdrop-blur-md bg-black/40 p-2 rounded-full"
            >
              <span
                className={`text-xl ${
                  favorite
                    ? "text-red-500 drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]"
                    : "text-white"
                }`}
              >
                {favorite ? <FaHeart /> : <FaRegHeart />}
              </span>
            </button>
          </div>

          {/* INFO */}
          <div className="flex-1 text-center md:text-left">

            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={details.name}
                className="max-h-20 md:max-h-28 mb-4 mx-auto md:mx-0"
              />
            ) : (
              <h1 className="text-3xl md:text-5xl font-bold text-amber-400 mb-4">
                {details.name}
              </h1>
            )}

            <p className="text-gray-300 max-w-3xl">
              {details.overview}
            </p>

            <div className="mt-6 space-y-2">
              <p>⭐ {details.vote_average?.toFixed(1)}</p>
              <p>📅 First Air: {details.first_air_date}</p>
              <p>🎞 Seasons: {details.number_of_seasons}</p>
            </div>
          </div>
        </div>

        {/* CAST */}
        {cast.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-amber-400 mb-6">Cast</h2>
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl text-center"
                >
                  {actor.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SEASON & EPISODE SELECTOR */}
        <div className="mt-12 flex flex-wrap gap-6 items-end">

          <div className="flex flex-col gap-1">
            <label className="text-amber-400 font-semibold text-sm">Season</label>
            <select
              className="px-4 py-2 rounded-xl bg-white/10 border border-amber-400/30 text-white w-48"
              value={season}
              onChange={(e) => {
                setSeason(Number(e.target.value));
                setEpisode(1);
              }}
            >
              {seasonsData
                .filter((s) => s.season_number !== 0)
                .map((s) => (
                  <option key={s.id} value={s.season_number} className="bg-[#1D232A]">
                    Season {s.season_number}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-amber-400 font-semibold text-sm">Episode</label>
            <select
              className="px-4 py-2 rounded-xl bg-white/10 border border-amber-400/30 text-white w-48"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
            >
              {Array.from({ length: totalEpisodes }, (_, i) => (
                <option key={i + 1} value={i + 1} className="bg-[#1D232A]">
                  Episode {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 h-10 flex items-center rounded-full border border-amber-400/50 text-amber-400 text-sm">
            S{season} • E{episode} • {totalEpisodes} Episodes
          </div>
        </div>

        {/* STREAMING */}
        <div className="mt-20">
          <StreamingBox
            tmdbId={id}
            type="tv"
            season={season}
            episode={episode}
          />
        </div>

        {/* RECOMMENDATIONS */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-semibold text-amber-400 mb-6">
              More Like This
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recommendations.map((show) => (
                <MovieCard
                  key={show.id}
                  movie={{ ...show, title: show.name }}
                  type="tv"
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}