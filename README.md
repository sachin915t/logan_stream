

 <img src="./public/icon1.png" width="100" height="100">

# 🎬 Logan Stream

A modern, AI-enhanced streaming platform for movies, TV shows, and anime. Built with React, FastAPI, and powered by TMDB API.

![Logan Stream](https://img.shields.io/badge/React-18-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-blue?logo=render)

---
### Project link: [logan-stream](https://loganai.in)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [AI Search Feature](#ai-search-feature)
- [Deployment](#deployment)

---

## ✨ Features

### 🎥 Content Discovery
- **Hero Slider** - Full-bleed featured content carousel with auto-play
- **Genre Sections** - Filter movies and TV shows by genre
- **Top 100 Lists** - Curated top-rated content pages (100 items paginated from TMDB)
- **Anime Section** - Dedicated anime discovery using TMDB keyword filtering (keyword ID: 210024)
- **Search** - Global search with real-time results

### 🤖 AI Integration
- **AI Chat Assistant** (`/ai-search`) - Natural language search with genre/year parsing
- **Smart Query Parsing** - Detects genres (horror, comedy, anime) and years from text
- **Fallback Recommendations** - Returns popular content when no exact match found

### ❤️ User Features
- **Favorites System** - Save and manage favorite movies/shows with localStorage
- **Persistent Storage** - No login required, data saved locally
- **Toast Notifications** - Beautiful feedback for user actions

### 🎨 UI/UX
- **Glassmorphism Design** - Modern frosted glass UI elements
- **Responsive Layout** - Mobile-first, works on all devices
- **Smooth Animations** - Framer Motion page transitions
- **3D Hover Effects** - Interactive movie card transformations
- **Loading Skeletons** - Better perceived performance

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **Vite** | Build Tool |
| **React Router v6** | Client-side Routing |
| **TanStack Query** | Server State Management |
| **Framer Motion** | Animations |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python Web Framework |
| **HTTPX** | Async HTTP Client |
| **TMDB API** | Movie/TV/Anime Data Source |
| **Uvicorn** | ASGI Server |
| **python-dotenv** | Environment management |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend Hosting |
| **Render** | Backend Hosting (Private Repo) |

---

## 📁 Project Structure

```
logan_stream/
├── 📁 frontend/                 # React Application (Public)
│   ├── 📁 src/
│   │   ├── 📁 components/      # UI components
│   │   │   ├── AIChat.jsx
│   │   │   ├── HeroSlider.jsx
│   │   │   ├── MovieCard.jsx
│   │   │   └── ...
│   │   ├── 📁 context/         # React Context
│   │   ├── 📁 pages/           # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Anime.jsx
│   │   │   └── ...
│   │   ├── 📁 services/        # API calls (api.js)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend/                  # FastAPI (Private)
│   ├── main.py                 # All routes & AI logic
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_TMDB_KEY=your_tmdb_api_key
VITE_SITE_PASSWORD=optional_password
```

### Backend (.env)
```env
TMDB_API_KEY=your_tmdb_api_key
PORT=10000
```

---

## 🔌 API Documentation

### Base URL
```
Production: https://your-backend.onrender.com
Local: http://localhost:8000
```

### Movies
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/` | GET | Health check | - |
| `/latest` | GET | Now playing movies | - |
| `/top100` | GET | Top 100 rated movies (5 pages) | - |
| `/genre/{genre_id}` | GET | Movies by genre | `genre_id`: int |
| `/movie/discover` | GET | Discover with filters | `with_origin_country`, `sort_by`, `vote_average_gte` |
| `/movie/{movie_id}` | GET | Movie details + credits | `movie_id`: int |
| `/movie/{movie_id}/recommendations` | GET | Similar movies | - |
| `/movie/{movie_id}/images` | GET | Movie images | - |

### TV Shows
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/tv/latest` | GET | Popular TV shows | - |
| `/tv/top100` | GET | Top 100 rated TV (5 pages) | - |
| `/tv/genre/{genre_id}` | GET | TV by genre | `genre_id`: int |
| `/tv/discover` | GET | Discover with filters | `with_origin_country`, `sort_by`, `vote_average_gte` |
| `/tv/{tv_id}` | GET | TV details + credits | `tv_id`: int |
| `/tv/{tv_id}/recommendations` | GET | Similar shows | - |
| `/tv/{tv_id}/images` | GET | TV images | - |

### Anime
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/top-anime` | GET | Top 100 anime (keyword: 210024, vote_count ≥ 200) |

### Search
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/search` | GET | Search movies/TV | `query`: string, `type`: "movie" \| "tv" |
| `/ai-search` | POST | AI natural language search | `{"message": "horror movies 2023"}` |

---

## 🤖 AI Search Feature

The `/ai-search` endpoint parses natural language queries:

### Supported Genres
```python
{
    "horror": 27, "comedy": 35, "thriller": 53,
    "action": 28, "romance": 10749, "romantic": 10749,
    "sci-fi": 878, "drama": 18, "anime": 16, "animation": 16
}
```

### Query Examples
| Input | Action |
|-------|--------|
| `"horror"` | Returns top horror movies/TV |
| `"comedy movies 2020"` | Comedy from 2020 |
| `"anime"` | Returns anime shows |
| `"Inception"` | Searches for "Inception" |
| `"sci-fi shows"` | Sci-fi TV shows |

### Logic Flow
1. **Parse query** - Extract genre ID and year
2. **Genre-only queries** → Discover endpoint with popularity sort
3. **Specific search** → Multi-search endpoint
4. **Fallback** → Filter by vote_count > 30, then genre discover

---

## 🚀 Deployment

### Frontend (Vercel) - Public Repo
```bash
# Already connected to GitHub
# Auto-deploys on push to main
# Preview deployments for all branches
```

**Settings:**
- Framework: `Vite`
- Build: `npm run build`
- Output: `dist`

### Backend (Render) - Private
The backend code is **private** and deployed separately on Render.

**Start Command:**
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Key Features:**
- CORS enabled for all origins (`*`)
- Graceful shutdown with `client.aclose()`
- Async HTTPX client for all TMDB calls
- Pagination support (5 pages = 100 results)

---

## 📝 Backend Code Structure

```python
# main.py - Key Components:

1. FastAPI app with CORS middleware
2. TMDB API integration via HTTPX
3. AI query parser (genres + years)
4. Route ordering (specific routes before path params)
5. Pagination loops for top 100 endpoints
6. Anime keyword filtering (210024)
7. Graceful shutdown handler
```

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the comprehensive API
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting

---

**Made with ❤️ by [Sachin](https://github.com/sachin915t)**

---
