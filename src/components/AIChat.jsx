import { useState } from "react";
import { aiSearch } from "../services/api";
import { Link } from "react-router-dom";
import ScrollToTopButton from "./ScrollToTopButton";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const res = await aiSearch(message);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
          {/* Floating Stack */}
  <div
  className={`fixed right-6 flex flex-col items-end gap-3 z-50 transition-all duration-300 ${
    open ? "bottom-9 right-12" : "bottom-24"
  }`}
>
  <ScrollToTopButton />

  {!open && (
    <button
      onClick={() => setOpen(true)}
      className="btn btn-warning btn-circle shadow-xl"
    >
      AI
    </button>
  )}
</div>
      {/* Chat Box */}
      {open && (
        <div
          className="
            fixed
            bottom-24
            right-6
            w-80
            bg-base-200
            text-white
            rounded-xl
            shadow-2xl
            z-50
            p-4
            border border-warning
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-warning">
              Logan.AI
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="btn btn-xs btn-circle btn-ghost"
            >
              ✕
            </button>
          </div>

          {/* Input */}
          <div className="flex gap-2 mb-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask movies, tv, anime..."
              className="input input-sm input-warning w-full"
            />
            <button
              onClick={handleSend}
              className="btn btn-sm btn-warning"
            >
              Go
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-3">
              <span className="loading loading-spinner loading-sm text-warning"></span>
            </div>
          )}

          {/* Results */}
          <div className="max-h-60 overflow-y-auto space-y-2">
            {results.map((item) => {
              const type =
                item.media_type === "tv" ? "tv" : "movie";
              const title = item.title || item.name;

              return (
                <Link
                  key={item.id}
                  to={`/${type}/${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block bg-base-300 hover:bg-base-100 transition p-2 rounded text-sm"
                >
                  <div className="flex justify-between">
                    <span>{title}</span>
                    <span className="text-xs opacity-60 uppercase">
                      {type}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}