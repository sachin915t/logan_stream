import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieCard from "./MovieCard";
import { FaRegHandPointUp } from "react-icons/fa";

export default function GenreSection({
  title,
  genres,
  fetchFunction,
  type = "movie",
  defaultGenre = null,
}) {
  const [selectedGenre, setSelectedGenre] = useState(defaultGenre || null);

  // ✅ Sync when defaultGenre changes (important when switching movie/tv tabs)
  useEffect(() => {
    setSelectedGenre(defaultGenre || null);
  }, [defaultGenre]);

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["genre", type, selectedGenre?.id],
    queryFn: async () => {
      if (!selectedGenre) return [];
      const res = await fetchFunction(selectedGenre.id);
      return res.data.slice(0, 12);
    },
    enabled: !!selectedGenre,
    staleTime: 1000 * 60 * 10, // 10 min cache
    keepPreviousData: true, // smoother UX when switching genres
  });

  return (
    <div className="mt-14">
      <h2 className="text-3xl font-bold text-amber-500 mb-6">{title}</h2>

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre)}
            className={`btn btn-sm ${
              selectedGenre?.id === genre.id
                ? "btn-warning"
                : "btn-outline"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* No genre selected */}
      {!selectedGenre && (
  <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
    <FaRegHandPointUp className="text-xl mb-2 animate-bounce" />
    <p>Select a genre to browse</p>
  </div>
)}

      {/* Loading */}
      {isLoading && selectedGenre && (
        <div className="flex justify-center mt-10">
          <span className="loading loading-spinner loading-lg text-warning"></span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-red-400 text-center mt-6">
          Failed to load genre.
        </p>
      )}

      {/* Grid */}
      {!isLoading && selectedGenre && data.length > 0 && (
        <div
          className="grid gap-6
                     grid-cols-2
                     sm:grid-cols-3
                     md:grid-cols-4
                     lg:grid-cols-5"
        >
          {data.map((item) => (
            <MovieCard
              key={item.id}
              movie={{
                ...item,
                title: type === "tv" ? item.name : item.title,
              }}
              type={type}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && selectedGenre && data.length === 0 && (
        <p className="text-gray-400 text-center mt-6">
          No content available for this genre.
        </p>
      )}
    </div>
  );
}