import { useEffect, useState } from "react";
import {
  getLatest,
  getLatestTV,
  getByGenre,
  getTVByGenre
} from "../services/api";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import GenreSection from "../components/GenreSection";
import { useLoading } from "../context/LoadingContext";
import HeroSlider from "../components/HeroSlider";
import { prepareSliderData } from "../utils/prepareSliderData";
import { fetchTVDetails, fetchMovieDetails } from "../services/api";
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
 
  const { setLoading } = useLoading();

// 🔥 First query
  const {
    data: latestData,
    isLoading: latestLoading,
  } = useQuery({
    queryKey: ["home-latest"],
    queryFn: async () => {
      const [moviesRes, tvRes] = await Promise.all([
        getLatest(),
        getLatestTV(),
      ]);

      return {
        movies: moviesRes.data.slice(0, 8),
        tv: tvRes.data.slice(0, 8),
      };
    },
    staleTime: 1000 * 60 * 10,
  });

  // 🔥 Second query
  const {
    data: featuredShows = [],
    isLoading: featuredLoading,
  } = useQuery({
    queryKey: ["home-featured"],
    queryFn: async () => {
      const FEATURED_IDS = [
        { id: 1396, type: "tv" },
        { id: 60059, type: "tv" },
        { id: 37854, type: "tv" },
        { id: 1399, type: "tv" },
      ];

      return Promise.all(
        FEATURED_IDS.map(({ id, type }) =>
          type === "tv"
            ? fetchTVDetails(id).then((res) => ({
                ...res.data.details,
                media_type: "tv",
              }))
            : fetchMovieDetails(id).then((res) => ({
                ...res.data.details,
                media_type: "movie",
              }))
        )
      );
    },
    staleTime: 1000 * 60 * 30,
  });

  // ✅ NOW derive values
  const latestMovies = latestData?.movies || [];
  const latestTV = latestData?.tv || [];
  const isLoading = latestLoading || featuredLoading;

const FEATURED_IDS = [
  { id: 1396, type: "tv" },   // Breaking Bad
  { id: 60059, type: "tv" },  // Better Call Saul
  { id: 37854, type: "tv" },  // One Piece
  { id: 1399, type: "tv" },   // Game of Thrones
];



  return (
    <div className="min-h-screen bg-[#1D232A] text-white">
   {!isLoading && latestMovies.length > 0 && (
  <HeroSlider
  items={prepareSliderData(
    [...featuredShows, ...prepareSliderData([...latestMovies, ...latestTV], "random").slice(0, 2)],
    "random"
  )}
  type="movie"
/>
)}

  <div className="max-w-7xl mx-auto px-6 py-10">

    {isLoading ? (
      <div className="flex justify-center items-center min-h-[60vh]">
      </div>
    ) : (
      <>
        {/* 🔥 Featured Movies */}
        <SectionTitle title="Featured Movies" />
        <ResponsiveGrid>
          {latestMovies.slice(0, 4).map(movie => (
           
            <MovieCard key={movie.id} movie={movie} variant="featured"/>
            
          ))}
        </ResponsiveGrid>

        {/* 🎬 Movie Genres */}
        <GenreSection
          title="Movie Genres"
          genres={movieGenres}
                fetchFunction={getByGenre}
                defaultGenre={movieGenres[0]}
        />

        {/* 📺 Featured TV */}
        <SectionTitle title="Featured TV Shows" />
        <ResponsiveGrid>
          {latestTV
    .filter(show =>
      show.vote_average >= 6.8 &&  // decent rating
      show.vote_count >= 100 &&    // reliable votes
      show.poster_path &&
      show.first_air_date          // has date
    )
    .sort((a, b) => 
      new Date(b.first_air_date) - new Date(a.first_air_date)
    )
    .slice(0, 4)
    .map(show => (
      <MovieCard
        key={show.id}
        movie={{ ...show, title: show.name }}
        type="tv"
        variant="featured"
      />
    ))}
        </ResponsiveGrid>

        {/* 📺 TV Genres */}
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

function SectionTitle({ title }) {
  return (
    <h2 className="text-3xl font-bold text-amber-500 mt-14 mb-6">
      {title}
    </h2>
  );
}

function ResponsiveGrid({ children }) {
  return (
    <div className="grid gap-6 
                    grid-cols-1 
                    sm:grid-cols-2 
                    lg:grid-cols-4 mb-12">
      {children}
    </div>
  );
}