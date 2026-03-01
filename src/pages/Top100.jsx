import { useQuery } from "@tanstack/react-query";
import { getTop100 } from "../services/api";
import MovieCard from "../components/MovieCard";
import HeroSlider from "../components/HeroSlider";
import { prepareSliderData } from "../utils/prepareSliderData";

export default function Top100() {

  const {
    data: movies = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-100"],
    queryFn: async () => {
      const res = await getTop100();
      return res.data;
    },
    staleTime: 1000 * 60 * 15, // 15 min cache
  });

  if (isError) {
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        <p className="text-red-500">Failed to load Top 100 movies.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1D232A] min-h-screen text-white">

      {/* 🎬 Hero Slider */}
      {!isLoading && movies.length > 0 && (
        <div className="w-full">
          <HeroSlider
            items={prepareSliderData(movies, "random")}
            type="movie"
          />
        </div>
      )}

      {/* 📦 Content */}
      <div className="max-w-7xl mx-auto px-4 mt-10 pb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-300 mb-8">
          Top 100 Movies
        </h1>

        {isLoading && (
          <div className="flex justify-center mt-20">
            <span className="loading loading-spinner loading-lg text-warning"></span>
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
