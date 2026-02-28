import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function MovieCard({ movie, type }) {
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
  className="
    relative group
    bg-white/5
    backdrop-blur-xl
    border border-white/10
    rounded-2xl
    overflow-hidden
    shadow-md
    transition-all duration-300
    sm:hover:scale-[1.03]
    sm:hover:shadow-2xl
  "
>
          <button
  onClick={(e) => {
    e.preventDefault();
    toggleFavorite({
      id: movie.id,
      title: movie.title || movie.name,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      type: mediaType
    });
  }}
  className="
    absolute top-2 left-2 z-20
    opacity-100 sm:opacity-0
    sm:group-hover:opacity-100
    transition-all duration-300
    backdrop-blur-md
    cursor-pointer
    bg-black/50
    p-2 rounded-full
    hover:scale-110
  "
>
  {favorite ? "❤️" : "🤍"}
</button>
        {/* Poster */}
        <div className="relative ">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt={movie.title || movie.name}
            className="
              w-full
              aspect-[2/3]
              object-cover
            "
            loading="lazy"
          />

          {/* Rating Badge */}
          <div
            className="
              absolute top-1.5 right-1.5
              bg-black/70
              text-[10px] sm:text-xs
              px-2 py-0.5
              rounded
            "
          >
            ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </div>
        </div>

        {/* Title */}
        <div className="p-2 sm:p-3">
          <h2 className="text-xs sm:text-sm font-semibold line-clamp-2">
            {movie.title || movie.name}
          </h2>
        </div>
        </div>
        </div>
    </Link>
  );
}