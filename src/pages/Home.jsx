import {
  getLatest,
  getLatestTV,
  getByGenre,
  getTVByGenre,
} from "../services/api";

import MovieCard from "../components/MovieCard";
import GenreSection from "../components/GenreSection";
import HeroSlider from "../components/HeroSlider";
import { prepareSliderData } from "../utils/prepareSliderData";

import { useQuery } from "@tanstack/react-query";

const movieGenres = [
  { id: 27, name: "Horror" },
  { id: 35, name: "Comedy" },
  { id: 53, name: "Thriller" },
  { id: 28, name: "Action" },
];

const tvGenres = [
  { id: 10765, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 9648, name: "Mystery" },
];

export default function Home() {
  // --------------------------------
  // Latest Movies + TV
  // --------------------------------

  const {
    data: latestData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home-latest"],

    queryFn: async () => {
      const [moviesRes, tvRes] = await Promise.all([
        getLatest(),
        getLatestTV(),
      ]);

      return {
        movies: moviesRes.data?.slice(0, 12) || [],
        tv: tvRes.data?.slice(0, 12) || [],
      };
    },

    staleTime: 1000 * 60 * 10,

    // Don't refetch when returning to tab
    refetchOnWindowFocus: false,
  });

  const latestMovies = latestData?.movies || [];
  const latestTV = latestData?.tv || [];

  // --------------------------------
  // Hero Slider
  // --------------------------------

  const heroItems = prepareSliderData(
    [...latestMovies, ...latestTV],
    "random"
  );

  // --------------------------------
  // Featured Movies
  // --------------------------------

  const featuredMovies = latestMovies
    .filter(
      (movie) =>
        movie.poster_path &&
        movie.vote_average >= 6.8 &&
        movie.vote_count >= 100
    )
    .slice(0, 4);

  // --------------------------------
  // Featured TV
  // --------------------------------

  const featuredTV = latestTV
    .filter(
      (show) =>
        show.poster_path &&
        show.vote_average >= 6.8 &&
        show.vote_count >= 100 &&
        show.first_air_date
    )
    .sort(
      (a, b) =>
        new Date(b.first_air_date) -
        new Date(a.first_air_date)
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#1D232A] text-white">

      {/* =========================
          HERO
      ========================== */}

      {!isLoading && heroItems.length > 0 && (
        <HeroSlider
          items={heroItems}
          type="movie"
        />
      )}

      {/* =========================
          CONTENT
      ========================== */}

      <div className="
  max-w-7xl
  mx-auto
  px-4 sm:px-6
  py-8 md:py-10
">

        {/* Loading */}
        {isLoading && <HomeSkeleton />}

        {/* Error */}
        {isError && (
          <div className="flex min-h-[50vh] items-center justify-center">
            <p className="text-gray-400">
              Failed to load content.
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <>

            {/* =========================
                FEATURED MOVIES
            ========================== */}

            {featuredMovies.length > 0 && (
              <section>
                <SectionTitle title="Featured Movies" />

                <ResponsiveGrid>
                  {featuredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      variant="featured"
                    />
                  ))}
                </ResponsiveGrid>
              </section>
            )}


            {/* =========================
                MOVIE GENRES
            ========================== */}

            <GenreSection
              title="Movie Genres"
              genres={movieGenres}
              fetchFunction={getByGenre}
              defaultGenre={movieGenres[0]}
            />


            {/* =========================
                FEATURED TV
            ========================== */}

            {featuredTV.length > 0 && (
              <section>
                <SectionTitle title="Featured TV Shows" />

                <ResponsiveGrid>
                  {featuredTV.map((show) => (
                    <MovieCard
                      key={show.id}
                      movie={{
                        ...show,
                        title: show.name,
                      }}
                      type="tv"
                      variant="featured"
                    />
                  ))}
                </ResponsiveGrid>
              </section>
            )}


            {/* =========================
                TV GENRES
            ========================== */}

            <GenreSection
              title="TV Genres"
              genres={tvGenres}
              fetchFunction={getTVByGenre}
              type="tv"
              defaultGenre={tvGenres[0]}
            />

          </>
        )}
      </div>
    </div>
  );
}


/* =================================
   SECTION TITLE
================================= */

function SectionTitle({ title }) {
  return (
    <h2
      className="
        text-xl
        sm:text-2xl
        md:text-3xl
        font-bold
        text-amber-500
        mt-10
        md:mt-14
        mb-5
        md:mb-6
      "
    >
      {title}
    </h2>
  );
}


/* =================================
   RESPONSIVE GRID
================================= */

function ResponsiveGrid({ children }) {
  return (
    <div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        gap-3
        sm:gap-4
        lg:gap-6
        mb-10
        md:mb-12
      "
    >
      {children}
    </div>
  );
}


/* =================================
   HOME SKELETON
================================= */

function HomeSkeleton() {
  return (
    <div className="space-y-12">

      {/* Featured skeleton */}

      <section>
        <div className="h-7 w-48 rounded-lg bg-white/10 animate-pulse mb-6" />

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-3
            sm:gap-4
            lg:gap-6
          "
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div
                className="
                  aspect-[2/3]
                  w-full
                  rounded-xl
                  bg-white/10
                  animate-pulse
                "
              />

              <div className="mt-3 h-4 w-3/4 rounded bg-white/10 animate-pulse" />

              <div className="mt-2 h-3 w-1/2 rounded bg-white/10 animate-pulse" />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}