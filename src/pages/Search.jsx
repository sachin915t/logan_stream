import { useState, useEffect } from "react";
import { searchMedia, getByGenre, getTVByGenre, discoverMedia } from "../services/api";
import MovieCard from "../components/MovieCard";
import GenreSection from "../components/GenreSection";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { MdOutlineFilterAlt, MdOutlinePublic } from "react-icons/md";
import { BiReset, BiSort } from "react-icons/bi";
import { AiFillStar } from "react-icons/ai";

const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
];

const TV_GENRES = [
  { id: 10759, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi" },
  { id: 10768, name: "War" },
];

const COUNTRIES = [
  { code: "", name: "All Countries", lang: "" },
  { code: "US", name: "🇺🇸 USA", lang: "en" },
  { code: "KR", name: "🇰🇷 Korea", lang: "ko" },
  { code: "JP", name: "🇯🇵 Japan", lang: "ja" },
  { code: "IN", name: "🇮🇳 India", lang: "hi" },
  { code: "GB", name: "🇬🇧 UK", lang: "en" },
  { code: "FR", name: "🇫🇷 France", lang: "fr" },
  { code: "DE", name: "🇩🇪 Germany", lang: "de" },
  { code: "ES", name: "🇪🇸 Spain", lang: "es" },
];

const SORT_OPTIONS = [
  { value: "", name: "Relevant" },
  { value: "latest", name: "Latest" },
  { value: "rating", name: "Top Rated" },
  { value: "popular", name: "Most Popular" },
];

const RATING_OPTIONS = [
  { value: "", name: "Any Rating" },
  { value: "9", name: "9+ ⭐" },
  { value: "8", name: "8+ ⭐" },
  { value: "7", name: "7+ ⭐" },
  { value: "6", name: "6+ ⭐" },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [results, setResults] = useState([]);
  const [rawResults, setRawResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [country, setCountry] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState("");

  // ✅ Genre section sirf ek baar load ho
  const [genreLoaded, setGenreLoaded] = useState(false);

//   const applyFilters = (data) => {
//     let filtered = [...data];

//     if (minRating) {
//       filtered = filtered.filter((item) => item.vote_average >= parseFloat(minRating));
//     }

//     if (country) {
//   const selectedCountry = COUNTRIES.find((c) => c.code === country);
//   filtered = filtered.filter((item) =>
//     item.origin_country?.includes(country) ||
//     item.production_countries?.some((c) => c.iso_3166_1 === country) ||
//     //  lang match
//     (selectedCountry?.lang && item.original_language === selectedCountry.lang)
//   );
// }

//     if (sortBy === "latest") {
//       filtered.sort((a, b) =>
//         new Date(b.release_date || b.first_air_date || 0) -
//         new Date(a.release_date || a.first_air_date || 0)
//       );
//     } else if (sortBy === "rating") {
//       filtered.sort((a, b) => b.vote_average - a.vote_average);
//     } else if (sortBy === "popular") {
//       filtered.sort((a, b) => b.popularity - a.popularity);
//     }

//     return filtered;
//   };

  // Filter change hone pe re-apply


 const handleSearch = async () => {
  try {
    setLoading(true);
    setSearched(false);
    setResults([]);
    setRawResults([]);

    let raw = [];

    if (country && !query.trim()) {
      // ✅ Country filter hai, query nahi - discover use karo
      const sortMap = {
        "popular": "popularity.desc",
        "rating": "vote_average.desc",
        "latest": "primary_release_date.desc",
        "": "popularity.desc",
      };

      const res = await discoverMedia(type, {
        with_origin_country: country,
        sort_by: sortMap[sortBy] || "popularity.desc",
        vote_average_gte: minRating || undefined,
      });
      raw = res.data || [];

    } else if (query.trim()) {
      // Normal search + client side filter
      const res = await searchMedia(query, type);
      raw = res.data.results || [];
      if (raw.length < 10 && res.data.total_pages > 1) {
        const res2 = await searchMedia(query, type, 2);
        raw = [...raw, ...(res2.data.results || [])];
      }

    } else {
      // Kuch nahi - popular fetch karo
      const fetchFn = type === "movie" ? getByGenre : getTVByGenre;
      const res = await fetchFn(type === "movie" ? 28 : 10759);
      raw = res.data || [];
    }

    setRawResults(raw);
    setResults(raw);
    setSearched(true);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

 const resetFilters = () => {
  setCountry("");
  setSortBy("");
  setMinRating("");
  setQuery("");
  setResults([]);
  setRawResults([]);
  setSearched(false);
};
//   const handleApply = () => {
//   if (!rawResults.length) return;
//   const filtered = applyFilters(rawResults);
//   setResults(filtered);
  // };
  const handleApply = async () => {
  try {
    setLoading(true);

    const sortMap = {
      popular: "popularity.desc",
      rating: "vote_average.desc",
      latest: "primary_release_date.desc",
      "": "popularity.desc",
    };

    const params = {
      sort_by: sortMap[sortBy] || "popularity.desc",
      vote_average_gte: minRating || undefined,
      with_origin_country: country || undefined,
    };

    // If user typed query → use search
    let raw = [];

    if (query.trim()) {
      const res = await searchMedia(query, type);
      raw = res.data.results || [];
    } else {
      const res = await discoverMedia(type, params);
      raw = res.data || [];
    }

    setResults(raw);
    setRawResults(raw);
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

        <h1 className="text-3xl font-bold text-amber-400 mb-8">Search</h1>

        {/* Toggle */}
        <div className="tabs tabs-boxed mb-6">
          <button
            className={`tab ${type === "movie" ? "tab-active" : ""}`}
            onClick={() => {
              setType("movie");
              setSearched(false);
              setResults([]);
              setRawResults([]);
              resetFilters();
              setGenreLoaded(false);
            }}
          >
            Movies
          </button>
          <button
            className={`tab ${type === "tv" ? "tab-active" : ""}`}
            onClick={() => {
              setType("tv");
              setSearched(false);
              setResults([]);
              setRawResults([]);
              resetFilters();
              setGenreLoaded(false);
            }}
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
          <button onClick={handleSearch} className="btn btn-warning">
            Search
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mt-4 btn btn-sm btn-outline btn-warning gap-2"
        >
          <MdOutlineFilterAlt className="text-base" />
          Filters
          {showFilters ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap gap-4 justify-center">

            <div className="flex flex-col gap-1">
              <label className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                <MdOutlinePublic /> Country
              </label>
              <select
                className="select select-sm select-bordered bg-[#1D232A] border-amber-400/30 text-white"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                <BiSort /> Sort By
              </label>
              <select
                className="select select-sm select-bordered bg-[#1D232A] border-amber-400/30 text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                <AiFillStar /> Min Rating
              </label>
              <select
                className="select select-sm select-bordered bg-[#1D232A] border-amber-400/30 text-white"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                {RATING_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
  <button
    onClick={handleApply}
    className="btn btn-sm btn-warning"
  >
    Apply
  </button>

  <button
    onClick={resetFilters}
    className="btn btn-sm btn-ghost text-gray-400 gap-1"
  >
    <BiReset className="text-base" />
    Reset
  </button>
</div>
          </div>
        )}

        {/* Results / GenreSection */}
        <div className="w-full mt-10 min-h-[300px]">

          {loading && (
            <div className="flex items-center justify-center mt-20">
              <span className="loading loading-spinner loading-lg text-warning"></span>
            </div>
          )}

          {/* ✅ Search Results */}
          {!loading && searched && results.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {results.map((item) => (
                <MovieCard key={item.id} movie={item} type={type} />
              ))}
            </div>
          )}

          {/* No results */}
          {!loading && searched && results.length === 0 && (
            <p className="text-gray-400 text-center mt-6 mb-6">No results found.</p>
          )}

          {/* ✅ GenreSection - sirf tab dikhao jab search nahi hua */}
          {!loading && !searched && (
            <GenreSection
              key={type} // type change pe re-mount
              title={type === "movie" ? "Browse Movies" : "Browse TV Shows"}
              genres={type === "movie" ? MOVIE_GENRES : TV_GENRES}
              fetchFunction={type === "movie" ? getByGenre : getTVByGenre}
              type={type}
            />
          )}

        </div>
      </div>
    </div>
  );
}