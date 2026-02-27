import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../services/api";
import StreamingBox from "../components/StreamingBox";

export default function MovieDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    fetchMovieDetails(id).then((res) => {
      setDetails(res.data.details);
      setCredits(res.data.credits);
    });
  }, [id]);

  if (!details)
    return (
      <div className="bg-[#1D232A] min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );

  const cast = credits?.cast?.slice(0, 8) || [];
  const director =
    credits?.crew?.find((person) => person.job === "Director");

  return (
  <div className="relative min-h-screen w-screen text-white overflow-x-hidden">

    {/* 🔥 FULL BACKDROP IMAGE */}
    <div className="fixed inset-0 -z-20">
      <img
        src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
        alt="Backdrop"
        className="w-full h-full object-cover blur-2xl scale-110 brightness-50"
      />
    </div>

    {/* DARK OVERLAY */}
    <div className="fixed inset-0 -z-10 bg-black/70"></div>

    {/* CONTENT */}
    <div className="relative px-6 md:px-12 py-20 max-w-7xl mx-auto">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">

          {/* Poster */}
          <div className="hover-3d">
            <figure className="max-w-100 rounded-2xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
          alt={details.title}
          className="w-56 md:w-72 rounded-2xl shadow-2xl hover:scale-105 transition"
            />
            </figure>
          </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold text-amber-400">
            {details.title}
          </h1>

          <p className="mt-6 text-gray-300 leading-relaxed max-w-3xl">
            {details.overview}
          </p>

          <div className="mt-6 space-y-2">
            <p>⭐ {details.vote_average?.toFixed(1)}</p>
            <p>📅 {details.release_date}</p>
            </div>
            
            <div className="mt-3 space-y-2">
              {director && (
              <p>
                🎬 Directed by{" "}
                <span className="text-amber-400 font-semibold">
                  {director.name}
                </span>
              </p>
            )}
            </div>
          </div>
          
          
      </div>

      {/* Cast */}
      <div className="mt-20">
        <h2 className="text-2xl font-semibold text-amber-400 mb-6">
          Cast
        </h2>

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
          {cast.map((actor) => (
            <div
              key={actor.id}
              className="bg-base-200/40 backdrop-blur-md p-4 rounded-xl text-center hover:scale-105 transition"
            >
              {actor.name}
            </div>
          ))}
        </div>
      </div>

      {/* Streaming */}
      <div className="mt-20">
        <StreamingBox tmdbId={id} />
      </div>

    </div>
  </div>
);
}