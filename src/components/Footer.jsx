// components/Footer.jsx
import { motion } from "framer-motion";
import zoro from '../assets/zoro.svg'
export default function Footer() {
  return (
    <motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="text-center text-gray-400 py-10 border-t border-white/10 mt-16 flex flex-col items-center justify-center gap-3"
>
  {/* Zoro Icon */}
  <motion.img
    src={zoro}
    alt="zoro"
    className="w-24 h-24 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]"
    animate={{
      rotate: [0, 3, -3, 0],
      scale: [1, 1.05, 1],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Title */}
  <motion.p
    className="text-lg font-semibold text-amber-400 tracking-wide"
    animate={{
      textShadow: [
        "0px 0px 5px rgba(255,191,0,0.4)",
        "0px 0px 15px rgba(255,191,0,0.8)",
        "0px 0px 5px rgba(255,191,0,0.4)",
      ],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    Logan Stream © 2026
  </motion.p>

  {/* Tagline */}
  <motion.p
    className="text-xs text-gray-500 tracking-wider"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 1 }}
  >
    Streaming across the Grand Line
  </motion.p>
</motion.div>
  );
}