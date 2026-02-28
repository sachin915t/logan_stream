import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaHeart, FaFilm, FaTv, FaDragon } from "react-icons/fa";
import zoroIcon from '../assets/zoro.svg'


export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
const navLinkStyle = `
  transition-all duration-300
  hover:text-amber-400
  hover:drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]
`;
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
    <Link to="/" className="flex items-center gap-2">
  <img
    src={zoroIcon}
    alt="zoro icon"
    className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
  />
  <div className="flex flex-col leading-tight">
    <h1 className="text-amber-400 font-bold text-xl tracking-wide">
      LOGAN
    </h1>
    <span className="text-[10px] tracking-widest text-gray-400">
      FREEDOM
    </span>
  </div>
</Link>

    {/* Desktop Links */}
    <div className="hidden md:flex gap-8 text-sm font-medium ml-10">
      <Link to="/" className={navLinkStyle}>Home</Link>
      <Link to="/top100" className={navLinkStyle}>Top Movies</Link>
            <Link to="/tv/top100" className={navLinkStyle}>Top TV</Link>
            <Link to="/anime" className={navLinkStyle}>Anime</Link>
            <Link to="/favorites" className={navLinkStyle}>Favorites</Link>
            
      <Link to="/search" className={navLinkStyle}>Search</Link>
    </div>
  </div>
</div>

      {/* MOBILE BOTTOM ICON NAV */}
      <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] max-w-xs bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl py-3 px-6 flex justify-between items-center z-50 text-gray-300">

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
  to="/anime"
  className={`transition-all duration-300 active:scale-95 ${
    isActive("/anime") ? "text-amber-400 scale-110" : ""
  }`}
>
  <FaDragon size={22} />
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