import { useQuery } from "@tanstack/react-query";
import { getTopTV } from "../../services/api";
import MovieCard from "../../components/MovieCard";
import HeroSlider from "../../components/HeroSlider";
import { prepareSliderData } from "../../utils/prepareSliderData";

export default function TopTV() {

  const {
    data: shows = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-tv"],
    queryFn: async () => {
      const res = await getTopTV();
      return res.data;
    },
    staleTime: 1000 * 60 * 15, // 15 min cache
  });

  // Format for slider
  const formattedShows = shows.map((show) => ({
    ...show,
    title: show.name,
  }));

  if (isError) {
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        <p className="text-red-500">Failed to load Top TV Shows.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1D232A] min-h-screen text-white">

      {/* 🎬 Hero Slider */}
      {!isLoading && formattedShows.length > 0 && (
        <div className="w-full">
          <HeroSlider
            items={prepareSliderData(formattedShows, "random")}
            type="tv"
          />
        </div>
      )}

      {/* 📺 Content */}
      <div className="max-w-7xl mx-auto px-6 mt-10 pb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-400 mb-8">
          Top 100 TV Shows
        </h1>

        {isLoading && (
          <div className="flex justify-center mt-20">
            
          </div>
        )}

        {!isLoading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {shows.map((show) => (
              <MovieCard
                key={show.id}
                movie={{ ...show, title: show.name }}
                type="tv"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}