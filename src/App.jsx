import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Top100 from "./pages/Movies/Top100";
import Search from "./pages/Search";
import MovieDetails from "./pages/Movies/MovieDetails";
import TVDetails from "./pages/Tv/TVDetails";
import GlobalLoader from "./components/GlobalLoader";
import { useLoading } from "./context/LoadingContext";
import { attachLoadingSetter } from "./services/api";
import TopTV from "./pages/Tv/TopTV";
import Favorites from "./pages/Favorites";
import Anime from "./pages/Anime";
import zoroIcon from "./assets/zoro.svg";
import AIChat from "./components/AIChat";
import FavoriteToast from "./components/FavoriteToast";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";
import "./App.css";

// Separate component to use useLocation inside BrowserRouter
function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  //  no padding
  const noTopPadding = ["/", "/top100", "/tv/top100",'/anime'].includes(location.pathname);

  return (
    <>
      <GlobalLoader />
      <Navbar />
      <ScrollToTop />
      <AIChat />

      <div className={!noTopPadding ? "pt-28 md:pt-32 pb-24 md:pb-0" : "pb-24 md:pb-0"}>
  <AnimatePresence mode="wait">
    <motion.div
      key={location.pathname}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{
    duration: 0.35,
    ease: [0.22, 1, 0.36, 1] // smooth cinematic curve
  }}
    >
      <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/top100" element={<Top100 />} />
              <Route path="/tv/top100" element={<TopTV />} />
              <Route path="/anime" element={<Anime />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<TVDetails />} />
             </Routes>
    </motion.div>
        </AnimatePresence>
        <Footer />
</div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]">
        <FavoriteToast />
      </div>
    </>
  );
}

function App() {
  const { setLoading } = useLoading();
  const [isUnlocked, setIsUnlocked] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const correctPassword = import.meta.env.VITE_SITE_PASSWORD;

  useEffect(() => {
    let viewCount = parseInt(localStorage.getItem("siteViews") || "0");
    viewCount += 1;
    localStorage.setItem("siteViews", viewCount);
    if (viewCount > 3) {
      setIsUnlocked(false);
    } else {
      setIsUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      attachLoadingSetter(setLoading);
    }
  }, [isUnlocked, setLoading]);

  if (isUnlocked === null) return null;

  const handleUnlock = () => {
    if (passwordInput === correctPassword) {
      localStorage.setItem("siteViews", "0");
      setIsUnlocked(true);
    } else {
      alert("Wrong password");
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <img
          src={zoroIcon}
          alt="zoro"
          className="w-24 h-24 mb-6 animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        />
        <h1 className="text-2xl mb-4">Session Expired</h1>
        <input
          type="password"
          className="p-2 rounded bg-amber-50 text-black"
          placeholder="Enter password"
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <button
          onClick={handleUnlock}
          className="mt-4 px-6 py-2 bg-amber-400 text-black rounded"
        >
          Unlock
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;