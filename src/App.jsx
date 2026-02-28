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

import './App.css'

function App() {
  const { setLoading } = useLoading();

useEffect(() => {
  attachLoadingSetter(setLoading);
}, [setLoading]);
  return (
    <BrowserRouter>
      <Navbar />
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top100" element={<Top100 />} />
        <Route path="/tv/top100" element={<TopTV />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<TVDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;