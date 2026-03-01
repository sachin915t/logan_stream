import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiPlay1 } from "react-icons/ci";
import { fetchMediaLogo } from "../services/api";
import { useQuery } from "@tanstack/react-query";

export default function HeroSlider({ items = [], type = "movie" }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const currentItem = items[current];

  // 🔁 Auto Slide
  useEffect(() => {
    if (!items.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items]);

  // 🎨 Fetch logo ONLY for current slide
  const { data: logoPath } = useQuery({
    queryKey: ["logo", currentItem?.id],
    queryFn: async () => {
      const mediaType =
        currentItem.media_type === "tv" || type === "tv"
          ? "tv"
          : "movie";

      const res = await fetchMediaLogo(currentItem.id, mediaType);
      return res.data.logos?.[0]?.file_path || null;
    },
    enabled: !!currentItem?.id,
    staleTime: 1000 * 60 * 60,
  });

  if (!items.length) return null;

  const getRoute = (item) => {
    if (item.media_type === "tv" || type === "tv") return `/tv/${item.id}`;
    if (item.media_type === "anime" || type === "anime")
      return `/anime/${item.id}`;
    return `/movie/${item.id}`;
  };

  return (
    <div className="relative min-h-[105svh] md:min-h-[100svh] w-full overflow-hidden">
      {items.map((item, index) => {
        const backdrop = `https://image.tmdb.org/t/p/original${item.backdrop_path}`;

        // Only current slide gets logo
        const logo =
          index === current && logoPath
            ? `https://image.tmdb.org/t/p/w500${logoPath}`
            : null;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100 z-20" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 overflow-hidden">
              <img
    src={backdrop}
    alt=""
    className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${
      index === current
        ? "scale-[1.15]"
        : "scale-[1.08]"
    }`}
  />
            </div>

            {/* Single Cinematic Overlay */}
            <div
              className="absolute inset-0 
  bg-gradient-to-t 
  from-[#1D232A] 
  via-[#1D232A]/80 
  via-[#1D232A]/50 
  via-black/30 
  to-transparent"
            />

            {/* Content */}
            <div className="relative z-30 flex items-end justify-center md:justify-start min-h-[100svh] px-4 md:px-16 pb-24 md:pb-28">
              <div className="md:text-left md:max-w-xl text-center w-full max-w-md p-6 rounded-2xl">
                {/* Logo or Title */}
                {logo ? (
                  <img
                    src={logo}
                    alt={item.title || item.name}
                    className="mb-4 max-h-20 md:max-h-32 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] mx-auto md:mx-0"
                  />
                ) : (
                  <h1 className="text-2xl md:text-5xl font-bold mb-3 text-white">
                    {item.title || item.name}
                  </h1>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-sm flex-wrap">
                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                    ⭐ {item.vote_average?.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    {(item.release_date || item.first_air_date)?.slice(0, 4) ||
                      ""}
                  </span>
                </div>

                {/* Overview */}
                <p className="text-sm md:text-base text-gray-300 mb-6 line-clamp-2 md:line-clamp-3">
                  {item.overview}
                </p>

                {/* Play Button */}
                <div className="flex justify-center md:justify-start">
                  <button
                    onClick={() => navigate(getRoute(item))}
                    className="rounded-full px-7 py-2 font-semibold text-sm flex items-center gap-2 border border-amber-400/50  text-amber-400 transition-all duration-300 hover:bg-amber-400 hover:text-black hover:cursor-pointer"
                  >
                    <CiPlay1 className="text-lg" />
                    Play Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {items.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
              current === i ? "bg-amber-400 w-6" : "bg-white/40 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}