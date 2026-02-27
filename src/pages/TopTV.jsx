import { useEffect, useState } from "react";
import { getTopTV } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function TopTV() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopTV()
      .then((res) => {
        console.log("TV DATA:", res.data);
        setShows(res.data);
        
      })
      .catch((err) => {
        console.error("Top TV error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#1D232A] min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-6">

        <h1 className="text-3xl font-bold text-amber-400 mb-8">
          Top 100 TV Shows
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(170px,1fr))]">
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
