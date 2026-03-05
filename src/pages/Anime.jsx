import { useQuery } from "@tanstack/react-query";
import { getTopAnime } from "../services/api";
import MovieCard, { MovieCardSkeleton } from "../components/MovieCard";
import HeroSlider from "../components/HeroSlider";
import { prepareSliderData } from "../utils/prepareSliderData";

export default function TopAnime() {
  const {
    data: anime = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-anime"],
    queryFn: async () => {
      const res = await getTopAnime();
      return res.data;
    },
    staleTime: 1000 * 60 * 15,
  });

  if (isError) {
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        <p className="text-red-500">Failed to load Top Anime.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D232A] text-white">
      {/* ✅ FULL BLEED: No wrapper, no padding, edge-to-edge like Home */}
      {!isLoading && anime.length > 0 && (
  <div className="relative w-screen left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
    <HeroSlider 
      items={prepareSliderData(anime.slice(0, 6), "random")} 
      type="tv" 
    />
  </div>
)}

      {/* Content starts below with padding */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-amber-300 mb-8">
          Top Anime
        </h1>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[...Array(20)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {anime.map((show) => (
              <MovieCard key={show.id} movie={show} type="tv" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}