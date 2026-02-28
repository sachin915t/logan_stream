import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaHeart, FaFilm, FaTv } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR */}
      <div className="relative md:sticky md:top-4 z-50 flex justify-center px-2 mt-4 md:mt-0">
  <div className="
    w-auto
    bg-white/5 
    backdrop-blur-xl 
    border border-white/10 
    shadow-lg 
    rounded-xl 
    px-6 py-2 
    flex 
    justify-center md:justify-between 
    items-center 
    text-gray-200
  ">
    <Link to="/" className="flex items-center">
      <h1 className="text-amber-400 font-bold text-xl tracking-wide">
        LOGAN! 
      </h1>
    </Link>

    {/* Desktop Links */}
    <div className="hidden md:flex gap-8 text-sm font-medium ml-10">
      <Link to="/">Home</Link>
      <Link to="/top100">Top Movies</Link>
      <Link to="/tv/top100">Top TV</Link>
      <Link to="/favorites">Favorites</Link>
      <Link to="/search">Search</Link>
    </div>
  </div>
</div>

      {/* MOBILE BOTTOM ICON NAV */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-3 px-6 flex justify-between items-center z-50 text-gray-300">

        <Link
          to="/"
          className={`transition-all duration-300 active:scale-95 ${
            isActive("/") ? "text-amber-400 scale-110" : ""
          }`}
        >
          <FaHome size={22} />
        </Link>

        <Link
          to="/top100"
          className={`transition-all duration-300 active:scale-95 ${
            isActive("/top100") ? "text-amber-400 scale-110" : ""
          }`}
        >
          <FaFilm size={22} />
        </Link>

        <Link
          to="/tv/top100"
          className={`transition-all duration-300 active:scale-95 ${
            isActive("/tv/top100") ? "text-amber-400 scale-110" : ""
          }`}
        >
          <FaTv size={22} />
        </Link>

        <Link
          to="/favorites"
          className={`transition-all duration-300 active:scale-95 ${
            isActive("/favorites") ? "text-amber-400 scale-110" : ""
          }`}
        >
          <FaHeart size={22} />
        </Link>

        <Link
          to="/search"
          className={`transition-all duration-300 active:scale-95 ${
            isActive("/search") ? "text-amber-400 scale-110" : ""
          }`}
        >
          <FaSearch size={22} />
        </Link>

      </div>
    </>
  );
}