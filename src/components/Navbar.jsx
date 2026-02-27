import { Link } from "react-router-dom";

export default function Navbar() {
  return (<>

    <div className="sticky top-4 z-50 flex justify-center px-2">
  <div className="
    w-full 
    max-w-6xl 
    bg-white/5 
    backdrop-blur-xl 
    border border-white/10 
    shadow-lg 
    rounded-2xl 
    px-4 py-3 
    flex 
    flex-col 
    md:flex-row 
    md:justify-between 
    items-center 
    text-gray-200
  ">
    
    <Link to="/" className="flex items-center">
      <h1 className="text-amber-400 font-bold text-xl tracking-wide">
        LOGAN!
      </h1>
    </Link>

    <div className="
  flex 
  flex-wrap 
  justify-center 
  gap-4 
  md:gap-8 
  text-sm 
  font-medium 
  mt-3 
  md:mt-0
">
      <Link
        to="/"
        className="hover:text-amber-400 transition duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
      >
        Home
      </Link>

      <Link
        to="/top100"
        className="hover:text-amber-400 transition duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
      >
        Top Movies
          </Link>
          
          <Link
        to="/tv/top100"
        className="hover:text-amber-400 transition duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
      >
        Top TV
      </Link>

      <Link
        to="/search"
        className="hover:text-amber-400 transition duration-300 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-amber-400 after:transition-all hover:after:w-full"
      >
        Search
      </Link>
    </div>

  </div>
</div>

   

    </>
  );
}