import { useState } from "react";
import { searchMedia } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Search() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
  if (!query.trim()) return;

  try {
    setLoading(true);
    setSearched(false);

    setResults([]);  

    const res = await searchMedia(query, type);
    setResults(res.data.results || []);
    setSearched(true);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-[#1D232A] min-h-screen text-white py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

        <h1 className="text-3xl font-bold text-amber-400 mb-8">
          Search
        </h1>

        {/* Toggle */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${type === "movie" ? "tab-active" : ""}`}
            onClick={() => setType("movie")}
          >
            Movies
          </button>
          <button
            className={`tab ${type === "tv" ? "tab-active" : ""}`}
            onClick={() => setType("tv")}
          >
            TV Shows
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-4 w-full max-w-xl">
          <input
            type="text"
            placeholder="Search..."
            className="input input-warning w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="btn btn-warning"
          >
            Search
          </button>
        </div>

        {/* Results Section */}
        <div className="relative w-full mt-10">

          {/* Loading Overlay (keeps layout stable) */}
          <div className="relative w-full mt-10 min-h-[300px]">

  {loading && (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-warning"></span>
    </div>
  )}

  {results.length > 0 && (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {results.map((item) => (
        <MovieCard key={item.id} movie={item} type={type} />
      ))}
    </div>
  )}

  {!loading && searched && results.length === 0 && (
    <p className="text-gray-400 text-center mt-6">
      No results found.
    </p>
  )}

</div>

        </div>

      </div>
    </div>
  );
}