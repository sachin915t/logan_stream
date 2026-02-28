import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function MovieCard({ movie, type, variant = "normal" }) {
  if (!movie) return null;

  const mediaType =
    type ||
    movie.media_type ||
    (movie.title ? "movie" : "tv");

  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(movie.id);

  return (
    <Link
      to={`/${mediaType}/${movie.id}`}
      className="block group"
    >
      <div className="hover-3d">
      <div
        className={`
          bg-white/5
          backdrop-blur-xl
          border border-white/10
          rounded-2xl
          overflow-hidden
          shadow-md
          transition-all duration-300
          hover:shadow-xl
          hover:scale-[1.02]
          ${variant === "featured" ? "md:scale-100" : ""}
        `}
      >
        {/* Image Section */}
        <div className="relative">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title || movie.name}
            className="w-full aspect-[2/3] object-cover"
            loading="lazy"
          />

          {/* ❤️ Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite({
                id: movie.id,
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                type: mediaType,
              });
            }}
            className="
              absolute top-2 left-2 z-20
              bg-black/40 backdrop-blur-md
              p-2 rounded-full
              hover:scale-110 active:scale-90
              transition-all duration-300
            "
          >
            <span
              className={`text-lg ${
                favorite
                  ? "text-red-500 drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]"
                  : "text-white"
              }`}
            >
              {favorite ? <FaHeart /> : <FaRegHeart />}
            </span>
          </button>

          {/* Rating */}
          <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-0.5 rounded">
            ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        {/* Title Neeche */}
        <div className="p-3">
          <h2
            className={`
              font-semibold line-clamp-2 leading-snug
              ${variant === "featured"
                ? "text-base"
                : "text-sm"}
            `}
          >
            {movie.title || movie.name}
          </h2>
        </div>
        </div>
        </div>
    </Link>
  );
}