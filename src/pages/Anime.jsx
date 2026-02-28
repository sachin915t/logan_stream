import zoroIcon from "../assets/zoro.svg";

export default function Anime() {

    
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 text-gray-200">

      <div className="text-6xl mb-4 animate-pulse">
        <img
  src={zoroIcon}
  alt="zoro"
  className="w-24 h-24 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]"
/>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-wide">
        ANIME
      </h1>

      <p className="mt-2 text-gray-400 tracking-widest text-sm">
        COMING SOON
      </p>

      <p className="mt-6 max-w-md text-gray-500 text-sm">
        A new world of freedom, battles, and legends is under preparation.
        Stay tuned.
      </p>

    </div>
  );
}