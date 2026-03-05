import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMovieDetails,
  fetchRecommendations,
  fetchMediaLogo,
} from "../../services/api";
import StreamingBox from "../../components/StreamingBox";
import MovieCard from "../../components/MovieCard";
import { useFavorites } from "../../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MovieDetails() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();

  // 🔥 Movie Details
  const {
    data: detailsData,
    isLoading: detailsLoading,
  } = useQuery({
    queryKey: ["movie-details", id],
    queryFn: async () => {
      const res = await fetchMovieDetails(id);
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 Recommendations
  const {
    data: recommendations = [],
    isLoading: recLoading,
  } = useQuery({
    queryKey: ["movie-recommendations", id],
    queryFn: async () => {
      const res = await fetchRecommendations(id);
      return res.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 Logo
  const { data: logo } = useQuery({
    queryKey: ["movie-logo", id],
    queryFn: async () => {
      const res = await fetchMediaLogo(id, "movie");
      return res.data.logos?.[0]?.file_path || null;
    },
    staleTime: 1000 * 60 * 60,
  });

  if (detailsLoading || !detailsData) {
    return (
      <div className="bg-[#1D232A] h-screen text-white flex items-center justify-center">
        
      </div>
    );
  }

  const details = detailsData.details;
  const credits = detailsData.credits;
  const favorite = isFavorite(details?.id);
  const cast = credits?.cast?.slice(0, 8) || [];
  const director = credits?.crew?.find((person) => person.job === "Director");

  return (
    <div className="relative w-full text-white overflow-x-hidden">

      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="fixed inset-0 -z-20 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt="Backdrop"
            className="absolute top-0 left-0 w-full h-screen object-cover blur-sm brightness-50"
          />
        </div>
      )}

      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      <div className="relative px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
<div className="hover-3d">
          <div className="relative">
            
            <img
              src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
              alt={details.title}
              className="w-56 md:w-72 rounded-2xl shadow-2xl"
            />
</div>
            {/* Favorite Button */}
            <button
              onClick={() =>
                toggleFavorite({
                  id: details.id,
                  title: details.title,
                  poster_path: details.poster_path,
                  vote_average: details.vote_average,
                  type: "movie",
                })
              }
              className="absolute top-2 left-2 backdrop-blur-md bg-black/40 p-2 rounded-full transition"
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

          {/* Info */}
          <div className="flex-1 text-center md:text-left">

            {/* Logo or Title */}
            {logo ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${logo}`}
                alt={details.title}
                className="max-h-20 md:max-h-28 mb-4 mx-auto md:mx-0"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-400 mb-4">
                {details.title}
              </h1>
            )}

            <p className="text-gray-300 max-w-3xl">
              {details.overview}
            </p>

            <div className="mt-6 space-y-2">
              <p>⭐ {details.vote_average?.toFixed(1)}</p>
              <p>📅 {details.release_date}</p>
              {director && (
                <p>
                  🎬 Directed by{" "}
                  <span className="text-amber-400 font-semibold">
                    {director.name}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-6">
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-white/10 backdrop-blur-md p-3 rounded-xl text-center"
                >
                  {actor.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streaming */}
        <div className="mt-16">
          <StreamingBox tmdbId={id} />
        </div>

        {/* Recommendations */}
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-semibold text-amber-400 mb-6">
            More Like This
          </h2>

          {recLoading ? (
            <p className="text-gray-400">Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}