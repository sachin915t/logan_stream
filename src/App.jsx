import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Top100 from "./pages/Top100";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import TVDetails from "./pages/TVDetails";
import GlobalLoader from "./components/GlobalLoader";
import { useLoading } from "./context/LoadingContext";
import { attachLoadingSetter } from "./services/api";
import TopTV from "./pages/TopTV";
import Favorites from "./pages/Favorites";
import ScrollToTopButton from "./components/ScrollToTopButton";
import Anime from "./pages/Anime";
import zoroIcon from "./assets/zoro.svg";
// css
import "./App.css";

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

  //  IMPORTANT
  // attachLoadingSetter only when unlocked
  useEffect(() => {
    if (isUnlocked) {
      attachLoadingSetter(setLoading);
    }
  }, [isUnlocked, setLoading]);

  if (isUnlocked === null) return null; // prevent early render

  const handleUnlock = () => {
    if (passwordInput === correctPassword) {
      localStorage.setItem("siteViews", "0");
      setIsUnlocked(true);
    } else {
      alert("Wrong password");
    }
  };

  //  PASSWORD SCREEN
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <div className="text-6xl mb-4 animate-pulse">
                <img
          src={zoroIcon}
          alt="zoro"
          className="w-24 h-24 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
        />
              </div>
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

  //  ONLY MOUNT ROUTER IF UNLOCKED
  return (
    <BrowserRouter>
      <ScrollToTopButton />
      <Navbar />
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top100" element={<Top100 />} />
        <Route path="/tv/top100" element={<TopTV />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;