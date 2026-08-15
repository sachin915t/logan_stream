import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchMovieDetails,
  fetchTVDetails,
  fetchRecommendations,
  fetchTVRecommendations,
} from "../../services/api";

import StreamingBox from "../../components/StreamingBox";
import MovieCard from "../../components/MovieCard";
import { useFavorites } from "../../context/FavoritesContext";

import {
  FaHeart,
  FaRegHeart,
  FaPlay,
  FaShareAlt,
  FaStar,
  FaClock,
  FaCalendar,
  FaFilm,
} from "react-icons/fa";

export default function MediaDetails({ type }) {
  const { id } = useParams();
  const isTV = type === "tv";

  const { toggleFavorite, isFavorite } = useFavorites();
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: [type, id],
    queryFn: async () =>
      (
        isTV
          ? await fetchTVDetails(id)
          : await fetchMovieDetails(id)
      ).data,
    staleTime: 1000 * 60 * 10,
  });

  const { data: recommendations = [], isLoading: recLoading } =
    useQuery({
      queryKey: [`${type}-recommendations`, id],
      queryFn: async () =>
        (
          isTV
            ? await fetchTVRecommendations(id)
            : await fetchRecommendations(id)
        ).data || [],
      staleTime: 1000 * 60 * 10,
    });

  if (isLoading) return <Skeleton />;
  if (isError || !data)
    return (
      <div className="min-h-screen grid place-items-center text-white">
        Failed to load details.
      </div>
    );

  const details = data.details;
  const cast = data.credits?.cast?.slice(0, 8) || [];

  const title = isTV ? details.name : details.title;
  const date = isTV
    ? details.first_air_date
    : details.release_date;

  const favorite = isFavorite(details.id);

  const seasons = details.seasons?.filter(
    (s) => s.season_number !== 0
  ) || [];

  const currentSeason = seasons.find(
    (s) => s.season_number === season
  );

  const totalEpisodes =
    currentSeason?.episode_count || 1;

  const toggle = () =>
    toggleFavorite({
      id: details.id,
      title,
      poster_path: details.poster_path,
      vote_average: details.vote_average,
      type,
    });

  const share = async () => {
    try {
      await navigator.share({
        title,
        url: location.href,
      });
    } catch {}
  };

  return (
    <main className="relative min-h-screen text-white">

      {/* BACKDROP */}

      {details.backdrop_path && (
        <div className="fixed inset-0 -z-20 overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            className="w-full h-full object-cover scale-110 blur-md brightness-[.3]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/70 to-[#1D232A]" />
        </div>
      )}

      {/* CONTENT */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* HERO */}

        <section className="
          rounded-3xl
          border border-white/10
          bg-black/20
          backdrop-blur-xl
          p-5 md:p-8
        ">

          <div className="
            flex flex-col md:flex-row
            gap-7 md:gap-9
          ">

            {/* POSTER */}

            <div className="relative shrink-0 mx-auto md:mx-0">

              <img
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={title}
                className="
                  w-48 sm:w-56 md:w-60
                  rounded-2xl
                  shadow-2xl
                "
              />

              <button
                onClick={toggle}
                className="
                  btn btn-circle
                  absolute top-3 left-3
                  bg-black/60
                  border-white/10
                  backdrop-blur-md
                "
              >
                {favorite
                  ? <FaHeart className="text-red-500" />
                  : <FaRegHeart />}
              </button>

            </div>

            {/* INFO */}

            <div className="flex-1 text-center md:text-left">

              <span className="
                badge badge-outline
                text-amber-400
                border-amber-400/40
              ">
                {isTV ? "TV SERIES" : "MOVIE"}
              </span>

              <h1 className="
                text-3xl sm:text-4xl md:text-5xl
                font-bold mt-3
              ">
                {title}
              </h1>

              {/* GENRES */}

              <div className="
                flex flex-wrap
                justify-center md:justify-start
                gap-2 mt-4
              ">
                {details.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="
                      badge
                      bg-white/5
                      border-white/10
                      text-white/60
                    "
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* META */}

              <div className="
                flex flex-wrap
                justify-center md:justify-start
                gap-4 mt-5
                text-sm text-white/60
              ">

                <span>
                  <FaCalendar className="inline text-amber-400 mr-2" />
                  {date?.slice(0, 4)}
                </span>

                {isTV ? (
                  <span>
                    <FaFilm className="inline text-amber-400 mr-2" />
                    {details.number_of_seasons} Seasons
                  </span>
                ) : details.runtime ? (
                  <span>
                    <FaClock className="inline text-amber-400 mr-2" />
                    {Math.floor(details.runtime / 60)}h{" "}
                    {details.runtime % 60}m
                  </span>
                ) : null}

                <span className="text-amber-400 font-semibold">
                  <FaStar className="inline mr-1" />
                  {details.vote_average?.toFixed(1)}
                </span>

              </div>

              <p className="
                mt-5
                max-w-3xl
                text-sm md:text-base
                leading-7
                text-white/65
              ">
                {details.overview}
              </p>

              {/* ACTIONS */}

              <div className="
                flex flex-wrap
                justify-center md:justify-start
                gap-3 mt-6
              ">

                <button
                  disabled={!details.trailer_url}
                  onClick={() =>
                    window.open(
                      details.trailer_url,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="btn btn-warning rounded-full px-6"
                >
                  <FaPlay />
                  Trailer
                </button>

                <button
                  onClick={toggle}
                  className="
                    btn btn-circle
                    bg-white/5
                    border-white/10
                  "
                >
                  {favorite
                    ? <FaHeart className="text-red-500" />
                    : <FaRegHeart />}
                </button>

                <button
                  onClick={share}
                  className="
                    btn btn-circle
                    bg-white/5
                    border-white/10
                  "
                >
                  <FaShareAlt />
                </button>

              </div>

            </div>
          </div>
        </section>

        {/* TV CONTROLS */}

        {isTV && seasons.length > 0 && (
  <div className="flex flex-wrap items-center gap-3 mt-8">

    {/* Season */}
    <div className="dropdown">
      <button
        tabIndex={0}
        className="
          btn btn-sm
          w-40
          justify-between
          rounded-xl
          border-white/10
          bg-white/5
          text-white
          backdrop-blur-xl
          hover:bg-white/10
        "
      >
        Season {season}
        <span className="text-white/40">⌄</span>
      </button>

      <ul
        tabIndex={0}
        className="
          dropdown-content z-[50]
          mt-2
          w-40
          max-h-60
          overflow-y-auto
          rounded-xl
          border border-white/10
          bg-[#161b20]/95
          p-1
          shadow-xl
          backdrop-blur-xl
        "
      >
        {seasons.map((s) => (
          <li key={s.id}>
            <button
              onClick={(e) => {
                setSeason(s.season_number);
                setEpisode(1);
                e.currentTarget.blur();
              }}
              className={`
                w-full
                rounded-lg
                px-3 py-2
                text-left text-sm
                transition
                ${
                  season === s.season_number
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              Season {s.season_number}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Episode */}
    <div className="dropdown">
      <button
        tabIndex={0}
        className="
          btn btn-sm
          w-40
          justify-between
          rounded-xl
          border-white/10
          bg-white/5
          text-white
          backdrop-blur-xl
          hover:bg-white/10
        "
      >
        Episode {episode}
        <span className="text-white/40">⌄</span>
      </button>

      <ul
        tabIndex={0}
        className="
          dropdown-content z-[50]
          mt-2
          w-40
          max-h-60
          overflow-y-auto
          rounded-xl
          border border-white/10
          bg-[#161b20]/95
          p-1
          shadow-xl
          backdrop-blur-xl
        "
      >
        {Array.from(
          { length: totalEpisodes },
          (_, i) => i + 1
        ).map((ep) => (
          <li key={ep}>
            <button
              onClick={(e) => {
                setEpisode(ep);
                e.currentTarget.blur();
              }}
              className={`
                w-full
                rounded-lg
                px-3 py-2
                text-left text-sm
                transition
                ${
                  episode === ep
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              Episode {ep}
            </button>
          </li>
        ))}
      </ul>
    </div>

    {/* Current */}
    <span className="
      badge
      h-8
      rounded-full
      border-amber-400/30
      bg-amber-400/5
      text-amber-400
    ">
      S{season} • E{episode}
    </span>

  </div>
)}

        {/* STREAMING */}

        <section className="mt-10">
          <StreamingBox
            tmdbId={id}
            type={type}
            season={isTV ? season : undefined}
            episode={isTV ? episode : undefined}
          />
        </section>

        {/* CAST */}

        {cast.length > 0 && (
          <section className="mt-12">

            <h2 className="text-2xl font-bold text-amber-400 mb-5">
              Cast
            </h2>

            <div className="
              grid
              grid-cols-2
              sm:grid-cols-4
              md:grid-cols-6
              lg:grid-cols-8
              gap-3
            ">
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="
                    rounded-xl
                    border border-white/10
                    bg-white/5
                    backdrop-blur-md
                    p-3
                    text-center
                    text-sm
                    text-white/60
                  "
                >
                  {actor.name}
                </div>
              ))}
            </div>

          </section>
        )}

        {/* RECOMMENDATIONS */}

        <section className="mt-12">

          <h2 className="text-2xl font-bold text-amber-400 mb-5">
            More Like This
          </h2>

          {recLoading ? (
            <div className="
              grid grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-4
            ">
              {[1, 2, 3, 4, 5].map((x) => (
                <div
                  key={x}
                  className="
                    aspect-[2/3]
                    rounded-xl
                    bg-white/10
                    animate-pulse
                  "
                />
              ))}
            </div>
          ) : (
            <div className="
              grid grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              gap-3 sm:gap-4
            ">
              {recommendations.map((item) => (
                <MovieCard
                  key={item.id}
                  movie={{
                    ...item,
                    title: isTV
                      ? item.name
                      : item.title,
                  }}
                  type={type}
                />
              ))}
            </div>
          )}

        </section>

      </div>
    </main>
  );
}


/* LOADING */

function Skeleton() {
  return (
    <div className="
      min-h-screen
      bg-[#1D232A]
      p-6 md:p-12
    ">
      <div className="
        max-w-6xl mx-auto
        flex flex-col md:flex-row
        gap-8
      ">
        <div className="
          w-56
          aspect-[2/3]
          rounded-2xl
          bg-white/10
          animate-pulse
        " />

        <div className="flex-1 space-y-5">
          <div className="h-10 w-2/3 bg-white/10 rounded-xl animate-pulse" />
          <div className="h-5 w-1/3 bg-white/10 rounded animate-pulse" />
          <div className="h-24 max-w-2xl bg-white/10 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}