import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchTVDetails,
  fetchTVRecommendations,
  fetchMediaLogo,
} from "../../services/api";
import StreamingBox from "../../components/StreamingBox";
import MovieCard, { MovieCardSkeleton } from "../../components/MovieCard";
import { useFavorites } from "../../context/FavoritesContext";
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
   <div className="relative min-h-screen w-full text-white overflow-x-hidden">

      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="fixed inset-0 -z-20">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt="Backdrop"
            className="w-full h-full object-cover blur-sm scale-110 brightness-30"
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
      <div className="mt-10 flex flex-wrap items-center gap-4">

  {/* Season */}
  <div className="dropdown">
    <button
      tabIndex={0}
      className="flex min-w-44 items-center justify-between
                 rounded-2xl border border-white/10
                 bg-white/[0.06] px-4 py-3
                 text-left backdrop-blur-xl
                 transition-all duration-300
                 hover:border-amber-400/30
                 hover:bg-white/[0.09]
                 active:scale-[0.98]"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40">
          Season
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          Season {season}
        </p>
      </div>

      <span className="ml-4 text-white/40">
        ▾
      </span>
    </button>

    <ul
      tabIndex={0}
      className="dropdown-content z-50 mt-2 max-h-72 w-52
                 overflow-y-auto rounded-2xl
                 border border-white/10
                 bg-[#151a21]/95
                 p-2 shadow-2xl
                 backdrop-blur-xl"
    >
      {seasonsData
        .filter((s) => s.season_number !== 0)
        .map((s) => (
          <li key={s.id}>
            <button
              onClick={() => {
                setSeason(s.season_number);
                setEpisode(1);
              }}
              className={`w-full rounded-xl px-4 py-2.5
                          text-left text-sm
                          transition-all duration-200
                          ${
                            season === s.season_number
                              ? "bg-amber-400/15 text-amber-400"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
            >
              Season {s.season_number}
            </button>
          </li>
        ))}
    </ul>
  </div>


  {/* Episode */}
  <div className="dropdown">
    <button
      tabIndex={0}
      className="flex min-w-44 items-center justify-between
                 rounded-2xl border border-white/10
                 bg-white/[0.06] px-4 py-3
                 text-left backdrop-blur-xl
                 transition-all duration-300
                 hover:border-amber-400/30
                 hover:bg-white/[0.09]
                 active:scale-[0.98]"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40">
          Episode
        </p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          Episode {episode}
        </p>
      </div>

      <span className="ml-4 text-white/40">
        ▾
      </span>
    </button>

    <ul
      tabIndex={0}
      className="dropdown-content z-50 mt-2 max-h-72 w-52
                 overflow-y-auto rounded-2xl
                 border border-white/10
                 bg-[#151a21]/95
                 p-2 shadow-2xl
                 backdrop-blur-xl"
    >
      {Array.from({ length: totalEpisodes }, (_, i) => {
        const ep = i + 1;

        return (
          <li key={ep}>
            <button
              onClick={() => setEpisode(ep)}
              className={`w-full rounded-xl px-4 py-2.5
                          text-left text-sm
                          transition-all duration-200
                          ${
                            episode === ep
                              ? "bg-amber-400/15 text-amber-400"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
            >
              Episode {ep}
            </button>
          </li>
        );
      })}
    </ul>
  </div>


  {/* Status */}
  <div
    className="rounded-full border border-amber-400/20
               bg-amber-400/[0.08]
               px-4 py-2.5
               text-sm backdrop-blur-xl"
  >
    <span className="font-bold text-amber-400">
      S{season}
    </span>

    <span className="mx-2 text-white/20">
      •
    </span>

    <span className="font-semibold text-white">
      E{episode}
    </span>

    <span className="mx-2 text-white/20">
      •
    </span>

    <span className="text-white/50">
      {totalEpisodes} eps
    </span>
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