import { useEffect, useState } from "react";
import { getTop100 } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Top100() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTop100()
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.error("Error fetching Top 100:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#1D232A] min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-4">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-300 mb-8">
          Top 100 Movies
        </h1>

        {loading && (
          <p className="text-gray-400 text-center">Loading movies...</p>
        )}

        {!loading && (
          <div
            className="
              grid
              gap-6
              grid-cols-[repeat(auto-fit,minmax(170px,1fr))]
            "
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}