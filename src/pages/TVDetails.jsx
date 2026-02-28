import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTVDetails, fetchTVRecommendations } from "../services/api";
import StreamingBox from "../components/StreamingBox";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function TVDetails() {
  const { id } = useParams();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetchTVDetails(id).then((res) => {
      setDetails(res.data.details);
      setCredits(res.data.credits);
    });

    fetchTVRecommendations(id).then((res) => {
      setRecommendations(res.data);
    });
  }, [id]);

  if (!details)
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  
  const { toggleFavorite, isFavorite } = useFavorites();
const favorite = isFavorite(details.id);

  const cast = credits?.cast?.slice(0, 8) || [];
  const seasonsData = details.seasons || [];

  const currentSeason = seasonsData.find(
    (s) => s.season_number === season
  );

  const totalEpisodes = currentSeason?.episode_count || 1;

  return (
    <div className="relative min-h-screen w-screen text-white overflow-x-hidden">

      {/* BACKDROP */}
      <div className="fixed inset-0 -z-20">
        <img
          src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
          alt="Backdrop"
          className="w-full h-full object-cover blur-sm scale-110 brightness-50"
        />
      </div>

      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      <div className="relative px-6 md:px-12 py-20 max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

          <div className="hover-3d">
          <div className="relative group">
  <img
    src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
    alt={details.name}
    className="w-56 md:w-72 rounded-2xl shadow-2xl hover:scale-105 transition"
              />
              </div>

  {/* ❤️ Favorite Button */}
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
    className="
      absolute top-2 left-2 z-20
      backdrop-blur-md
      cursor-pointer
      bg-black/40
      p-2 rounded-full
      hover:scale-110
      active:scale-90
      transition-all duration-300
    "
  >
    <span
      className={`
        text-xl transition-all duration-300
        ${
          favorite
            ? "text-red-500 scale-110 drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]"
            : "text-white"
        }
      `}
    >
      {favorite ? <FaHeart /> : <FaRegHeart />}
    </span>
  </button>
</div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-amber-400">
              {details.name}
            </h1>

            <p className="mt-6 text-gray-300 leading-relaxed max-w-3xl">
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
        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-amber-400 mb-6">
            Cast
          </h2>

          <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="bg-base-200/40 backdrop-blur-md p-4 rounded-xl text-center hover:scale-105 transition"
              >
                {actor.name}
              </div>
            ))}
          </div>
        </div>

        {/* SEASON & EPISODE SELECTOR */}
        <div className="mt-12 flex flex-wrap gap-6 items-end">

          {/* Season Select */}
          <div className="form-control w-48">
            <label className="label">
              <span className="label-text text-amber-400 font-semibold">
                Season
              </span>
            </label>

            <select
              className="select select-bordered bg-base border-amber-400/30 focus:border-amber-400"
              value={season}
              onChange={(e) => {
                const newSeason = Number(e.target.value);
                setSeason(newSeason);
                setEpisode(1);
              }}
            >
              {seasonsData
                .filter((s) => s.season_number !== 0)
                .map((s) => (
                  <option key={s.id} value={s.season_number}>
                    Season {s.season_number}
                  </option>
                ))}
            </select>
          </div>

          {/* Episode Select */}
          <div className="form-control w-48">
            <label className="label">
              <span className="label-text text-amber-400 font-semibold">
                Episode
              </span>
            </label>

            <select
              className="select select-bordered bg-base border-amber-400/30 focus:border-amber-400"
              value={episode}
              onChange={(e) => setEpisode(Number(e.target.value))}
            >
              {Array.from({ length: totalEpisodes }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Episode {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Info Badge */}
          <div className="badge badge-warning badge-outline h-10 px-4 text-sm">
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