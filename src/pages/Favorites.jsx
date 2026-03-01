import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="bg-[#1D232A] min-h-screen text-white pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-amber-400 mb-8">
          My Favorites
        </h1>

        {favorites.length === 0 ? (
          <p className="text-gray-400">No favorites yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((item) => (
              <MovieCard
                key={item.id}
                movie={item}
                type={item.type}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}