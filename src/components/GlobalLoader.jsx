import { useLoading } from "../context/LoadingContext";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export default function GlobalLoader() {
  const { loading } = useLoading();
  const location = useLocation();
  

   const isSearchPage = location.pathname === "/search";

  // Add your straw hat images here
  const strawHats = [
    "https://media.tenor.com/TmAJ69yqyywAAAAi/one-piece-one-piece-usopp.gif",
    "https://media.tenor.com/3odQw0NS2ZIAAAAj/one-piece-op.gif",
    "https://media.tenor.com/t_J_YBsvYRAAAAAi/chopper-toni-chopper.gif",
    "https://media.tenor.com/1MwwzHlaG10AAAAi/bonjour.gif",
    'https://media1.tenor.com/m/kBLFUIsrU2gAAAAd/zoro-one-piece-one-piece.gif',

  ];

  // Random image once per mount
  const randomImage = useMemo(() => {
    const index = Math.floor(Math.random() * strawHats.length);
    return strawHats[index];
  }, []);

  if (isSearchPage) return null;
if (!loading) return null;
  return (
 <div className="fixed inset-0 bg-[#1D232A]/90 flex items-center justify-center z-50">
      
      <div className="relative w-28 h-28 flex items-center justify-center">

        {/* Rotating Border */}
        <div className="absolute w-full h-full rounded-full 
                  border-2 border-amber-400 
                  border-t-transparent 
                  animate-spin">
  </div>

        {/* Image Circle */}
        <div className="w-20 h-20 rounded-full overflow-hidden">
    <img
      src={randomImage}
      alt="Loading"
      className="w-full h-full object-cover"
    />
  </div>

      </div>
    </div>
  );
}