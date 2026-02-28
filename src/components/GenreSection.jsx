import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function GenreSection({
  title,
  genres,
  fetchFunction,
  type = "movie"
}) {
  const [selectedGenre, setSelectedGenre] = useState(genres[0]);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchFunction(selectedGenre.id).then(res =>
      setData(res.data.slice(0, 12))
    );
  }, [selectedGenre]);

  return (
    <div className="mt-14">
      <h2 className="text-3xl font-bold text-amber-500 mb-6">
        {title}
      </h2>

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        {genres.map(genre => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre)}
            className={`btn btn-sm ${
              selectedGenre.id === genre.id
                ? "btn-warning"
                : "btn-outline"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-6 
                      grid-cols-2 
                      sm:grid-cols-3 
                      md:grid-cols-4 
                      lg:grid-cols-5">
        {data.map(item => (
          <MovieCard
            key={item.id}
            movie={{
              ...item,
              title: type === "tv" ? item.name : item.title
            }}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}