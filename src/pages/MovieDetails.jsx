import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchMovieDetails,
  fetchRecommendations,
} from "../services/api";
import StreamingBox from "../components/StreamingBox";
import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MovieDetails() {
  const { id } = useParams();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchMovieDetails(id).then((res) => {
      setDetails(res.data.details);
      setCredits(res.data.credits);
    });

    setLoadingRecs(true);
    fetchRecommendations(id).then((res) => {
      setRecommendations(res.data || []);
      setLoadingRecs(false);
    });
  }, [id]);

  if (!details)
    return (
      <div className="bg-[#1D232A] h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  const { toggleFavorite, isFavorite } = useFavorites();
const favorite = isFavorite(details?.id);

  const cast = credits?.cast?.slice(0, 8) || [];
  const director =
    credits?.crew?.find((person) => person.job === "Director");

  return (
    <div className="relative w-full text-white overflow-x-hidden">

      {/* Backdrop locked to viewport */}
      {details.backdrop_path && (
        <div className="fixed inset-0 -z-20 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt="Backdrop"
            className="absolute top-0 left-0 w-full h-screen object-cover blur-sm brightness-50"
          />
        </div>
      )}

      {/* Dark overlay */}
      <div className="fixed inset-0 -z-10 bg-black/70"></div>

      {/* Main Content */}
      <div className="relative px-4 sm:px-6 md:px-12 py-12 max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

          <div className="hover-3d">
            
            
          {/* Poster */}
            <div className="relative group">
  <img
    src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
    alt={details.name}
    className="w-56 md:w-72 rounded-2xl shadow-2xl transition"
              />
              </div>
              

  {/* ❤️ Favorite Button (Same Style as MovieCard) */}
  <button
    onClick={() =>
      toggleFavorite({
        id: details.id,
        title: details.name || details.title,
        poster_path: details.poster_path,
        vote_average: details.vote_average,
        type: "tv", // or detect dynamically if needed
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
            

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-amber-400">
              {details.title}
            </h1>

            <p className="mt-4 sm:mt-6 text-gray-300 leading-relaxed max-w-3xl text-sm sm:text-base">
              {details.overview}
            </p>

            <div className="mt-6 space-y-2 text-sm sm:text-base">
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

            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="bg-base-200/40 backdrop-blur-md p-3 rounded-xl text-center text-sm"
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

          {loadingRecs ? (
            <p className="text-gray-400">Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations found.</p>
          ) : (
            <div className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
            ">
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