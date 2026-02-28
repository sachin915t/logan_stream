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
  const [latestMovies, setLatestMovies] = useState([]);
  const [latestTV, setLatestTV] = useState([]);
  const { setLoading } = useLoading();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [moviesRes, tvRes] = await Promise.all([
        getLatest(),
        getLatestTV()
      ]);

      setLatestMovies(moviesRes.data.slice(0, 8));
      setLatestTV(tvRes.data.slice(0, 8));
    } catch (err) {
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  fetchData();
  }, []);
  

  return (
    <div className="min-h-screen bg-[#1D232A] text-white">
  <div className="max-w-7xl mx-auto px-6 py-10">

    {initialLoading ? (
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