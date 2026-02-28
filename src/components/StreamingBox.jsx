import { useState } from "react";

export default function StreamingBox({
  tmdbId,
  type = "movie",
  season = 1,
  episode = 1,
}) {
  const [server, setServer] = useState("cinesrc");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  //  Dynamic Server Config
  const servers = [
    {
      id: "vidsrc",
      name: "Server 1",
      movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}?autoPlay=false`,
      tv: (id, s, e) =>
        `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}?autoPlay=false`,
    },
    {
      id: "vidking",
      name: "Server 2",
      movie: (id) => `https://www.vidking.net/embed/movie/${id}`,
      tv: (id, s, e) =>
        `https://www.vidking.net/embed/tv/${id}/${s}/${e}`,
    },
    
    {
      id: "cinesrc",
      name: "Server 3",
      movie: (id) => `https://cinesrc.st/embed/movie/${id}`,
      tv: (id, s, e) =>
        `https://cinesrc.st/embed/tv/${id}?s=${s}&e=${e}`,
    }
  ];

  //  Get Active Server Source
  const getSrc = () => {
    const activeServer = servers.find((s) => s.id === server);
    if (!activeServer) return "";

    return type === "movie"
      ? activeServer.movie(tmdbId)
      : activeServer.tv(tmdbId, season, episode);
  };

  return (
    <>
      {/*  Warning */}
      {showWarning && (
        <div className="alert alert-warning shadow-lg rounded-xl flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>

            <span className="text-sm sm:text-base">
              For smoother streaming, use an ad blocker or browse with
              <span className="font-semibold"> Brave </span>
              or
              <span className="font-semibold"> Firefox</span>.
            </span>
          </div>

          <button
            onClick={() => setShowWarning(false)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        </div>
      )}

      {/*  Streaming Section */}
      <div className="mt-6 -mx-3 sm:mx-0">
  <div
    className="
      backdrop-blur-xl
      bg-white/5
      border border-amber-400/20
      shadow-2xl
      rounded-3xl
      p-4 sm:p-6
      transition-all duration-500
      hover:shadow-amber-400/20
    "
  >
    <h2 className="text-lg sm:text-2xl font-bold text-amber-400 mb-4">
      Watch Now
    </h2>

    {/* Server Buttons */}
    <div className="flex flex-wrap gap-2 sm:gap-4 mb-5">
      {servers.map((srv) => (
        <button
          key={srv.id}
          onClick={() => {
            setServer(srv.id);
            setIsPlaying(false);
          }}
          className={`
            px-3 sm:px-4
            py-1.5 sm:py-2
            text-xs sm:text-base
            rounded-xl
            border
            transition-all duration-300
            ${
              server === srv.id
                ? "bg-amber-400 text-black border-amber-400 shadow-md"
                : "border-amber-400/40 text-amber-400 hover:bg-amber-400/10"
            }
          `}
        >
          {srv.name}
        </button>
      ))}
    </div>

    {/* Responsive Player */}
    <div
      className={`
        relative
        w-full
        rounded-2xl
        overflow-hidden
        border border-amber-400/20
        bg-black
        transition-all duration-500
        ${
          isPlaying
            ? "ring-2 ring-amber-400/40 shadow-amber-400/30 shadow-xl"
            : ""
        }
      `}
      style={{
        minHeight: "220px",
      }}
    >
      {/* Mobile Taller Ratio */}
      <div className="w-full h-[260px] sm:h-[380px] md:h-[500px]">
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
            <button
              onClick={() => setIsPlaying(true)}
              className="
                bg-amber-400 text-black
                px-6 sm:px-8
                py-2 sm:py-3
                text-sm sm:text-base
                rounded-full
                font-semibold
                shadow-lg
                hover:scale-105
                hover:bg-amber-500
                transition-all duration-300
              "
            >
               Play {type === "tv" ? `S${season} E${episode}` : "Movie"}
            </button>
          </div>
        )}

        {isPlaying && (
          <iframe
            src={getSrc()}
            className="w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  </div>
</div>
    </>
  );
}