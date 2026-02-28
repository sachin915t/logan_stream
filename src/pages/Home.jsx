import { useEffect, useState } from "react";
import {
  getLatest,
  getByGenre,
  getLatestTV,
  getTVByGenre
} from "../services/api";
import MovieCard from "../components/MovieCard";
import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
  const [selectedMovieGenre, setSelectedMovieGenre] = useState(movieGenres[0]);
  const [movieGenreData, setMovieGenreData] = useState([]);

  const [latestTV, setLatestTV] = useState([]);
  const [selectedTVGenre, setSelectedTVGenre] = useState(tvGenres[0]);
  const [tvGenreData, setTvGenreData] = useState([]);

  useEffect(() => {
    getLatest().then(res =>
      setLatestMovies(res.data.slice(0, 8))
    );

    getLatestTV().then(res =>
      setLatestTV(res.data.slice(0, 8))
    );
  }, []);

  useEffect(() => {
    getByGenre(selectedMovieGenre.id).then(res =>
      setMovieGenreData(res.data.slice(0, 12))
    );
  }, [selectedMovieGenre]);

  useEffect(() => {
    getTVByGenre(selectedTVGenre.id).then(res =>
      setTvGenreData(res.data.slice(0, 12))
    );
  }, [selectedTVGenre]);

  return (
    <div className="min-h-screen bg-[#1D232A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* 🔥 FEATURED MOVIES */}
        <SectionTitle title="Featured Movies" />
        <ResponsiveGrid>
          {latestMovies.slice(0, 4).map(movie => (
            <div className="hover-3d">
            <Link key={movie.id} to={`/movie/${movie.id}`}>
             <MovieCard movie={movie} variant="featured" />
              </Link>
              </div>
          ))}
        </ResponsiveGrid>

        {/* 🎬 MOVIE GENRES */}
        <GenreSelector
          genres={movieGenres}
          selected={selectedMovieGenre}
          onSelect={setSelectedMovieGenre}
        />
        <AutoGrid>
          <div className="
  grid
  grid-cols-2
  gap-3
  sm:grid-cols-3
  md:grid-cols-4
  lg:grid-cols-5
">
          {movieGenreData.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
            </div>
        </AutoGrid>

        {/* 📺 FEATURED TV */}
        <SectionTitle title="Featured TV Shows" />
        <ResponsiveGrid>
          {latestTV.slice(0, 4).map(show => (
            <div className="hover-3d">
            <Link key={show.id} to={`/tv/${show.id}`}>
              <MovieCard movie={{ ...show, title: show.name }} type="tv" variant="featured" />
              </Link>
              </div>
          ))}
        </ResponsiveGrid>

        {/* 📺 TV GENRES */}
        <GenreSelector
          genres={tvGenres}
          selected={selectedTVGenre}
          onSelect={setSelectedTVGenre}
        />
        <AutoGrid>
          <div className="
  grid
  grid-cols-2
  gap-3
  sm:grid-cols-3
  md:grid-cols-4
  lg:grid-cols-5
">
          {tvGenreData.map(show => (
            <MovieCard
              key={show.id}
              movie={{
                ...show,
                title: show.name
              }}
              type="tv"
            />
          ))}
            </div>
        </AutoGrid>

      </div>
    </div>
  );
}

/* ---------- REUSABLE COMPONENTS ---------- */

function SectionTitle({ title }) {
  return (
    <h2 className="text-3xl font-bold text-amber-500 mt-14 mb-6">
      {title}
    </h2>
  );
}

function GenreSelector({ genres, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {genres.map(genre => (
        <button
          key={genre.id}
          onClick={() => onSelect(genre)}
          className={`btn btn-sm ${
            selected.id === genre.id
              ? "btn-warning"
              : "btn-outline"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
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

function AutoGrid({ children }) {
  return (
    <div className="grid gap-6 
                    grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
      {children}
    </div>
  );
}

function FeatureCard({ image, title, id, type = "movie", vote_average }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <div className="relative group card bg-base-200 shadow-xl hover:scale-105 transition">

      {/* ❤️ Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault(); // stop Link navigation
          toggleFavorite({
            id,
            title,
            poster_path: image,
            vote_average,
            type,
          });
        }}
        className="
          absolute top-2 left-2 z-20
          bg-black/40 backdrop-blur-md
          p-2 rounded-full
          hover:scale-110 active:scale-90
          transition-all duration-300
        "
      >
        <span
          className={`text-lg ${
            favorite
              ? "text-red-500 scale-110 drop-shadow-[0_0_6px_rgba(255,0,0,0.7)]"
              : "text-white"
          }`}
        >
          {favorite ? <FaHeart /> : <FaRegHeart />}
        </span>
      </button>

      <figure>
        <img
          src={`https://image.tmdb.org/t/p/w500${image}`}
          alt={title}
        />
      </figure>

      <div className="card-body p-3">
        <h2 className="card-title text-sm">{title}</h2>
      </div>
    </div>
  );
}