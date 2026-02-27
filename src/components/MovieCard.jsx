import { Link } from "react-router-dom";

export default function MovieCard({ movie, type }) {

  if (!movie) return null; // 🛑 safety guard

  const mediaType =
    type ||
    movie.media_type ||
    (movie.title ? "movie" : "tv");

  return (
    <Link
      to={`/${mediaType}/${movie.id}`}
      className="hover-3d cursor-pointer block"
    >
      <figure className="rounded-2xl">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl">

          <div className="relative">
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "https://via.placeholder.com/500x750?text=No+Image"
              }
              alt={movie.title || movie.name}
              className="w-full aspect-[2/3] object-cover"
            />

            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
              ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
            </div>
          </div>

          <div className="p-3">
            <h2 className="text-sm sm:text-base font-semibold line-clamp-2">
              {movie.title || movie.name}
            </h2>
          </div>

        </div>
      </figure>
    </Link>
  );
}