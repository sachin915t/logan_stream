import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Top100 from "./pages/Movies/Top100";
import Search from "./pages/Search";
// import MovieDetails from "./pages/Movies/MovieDetails";
// import TVDetails from "./pages/Tv/TVDetails";
import MediaDetails from "./pages/Media/MediaDetails";
import TopTV from "./pages/Tv/TopTV";
import Favorites from "./pages/Favorites";
import Anime from "./pages/Anime";

import AIChat from "./components/AIChat";
import FavoriteToast from "./components/FavoriteToast";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

import { AnimatePresence, motion } from "framer-motion";

import "./App.css";

// Separate component to use useLocation inside BrowserRouter
function AppContent() {
  const location = useLocation();
  

  const noTopPadding = [
    "/",
    "/top100",
    "/tv/top100",
    "/anime",
  ].includes(location.pathname);

  return (
    <>
      <Navbar />

      <ScrollToTop />

      <AIChat />

      <div
        className={
          !noTopPadding
            ? "pt-28 md:pt-32 pb-24 md:pb-0"
            : "pb-24 md:pb-0"
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />

              <Route path="/top100" element={<Top100 />} />

              <Route
                path="/tv/top100"
                element={<TopTV />}
              />

              <Route
                path="/anime"
                element={<Anime />}
              />

              <Route
                path="/favorites"
                element={<Favorites />}
              />

              <Route
                path="/search"
                element={<Search />}
              />

              {/* <Route
                path="/movie/:id"
                element={<MovieDetails />}
              />

              <Route
                path="/tv/:id"
                element={<TVDetails />}
              /> */}
              <Route
  path="/movie/:id"
  element={<MediaDetails type="movie" />}
/>

<Route
  path="/tv/:id"
  element={<MediaDetails type="tv" />}
/>

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
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;