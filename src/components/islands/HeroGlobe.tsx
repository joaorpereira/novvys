import { motion } from "framer-motion";
import GlobeCanvas from "./GlobeCanvas";

export default function HeroGlobe() {
  return (
    <motion.div
      className="hero-globe"
      initial={{ opacity: 0, scale: 0.88, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
    >
      {/* Ambient glow */}
      <motion.div
        className="hero-globe-glow"
        animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {/* Floating container */}
      <motion.div
        className="hero-globe-float"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <GlobeCanvas />
      </motion.div>

      {/* Orbital ring accents (CSS) */}
      <motion.div
        className="hero-globe-ring hero-globe-ring--1"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />
      <motion.div
        className="hero-globe-ring hero-globe-ring--2"
        animate={{ rotate: -360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        aria-hidden="true"
      />

      {/* Scan line */}
      <motion.div
        className="hero-globe-scan"
        animate={{ top: ["15%", "85%", "15%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <style>{`
        .hero-globe {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-globe-glow {
          position: absolute;
          width: 70%;
          height: 70%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.35) 0%,
            rgba(37, 99, 235, 0.08) 50%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
        }

        .hero-globe-float {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
        }

        .hero-globe-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(37, 99, 235, 0.08);
          pointer-events: none;
          z-index: 1;
        }

        .hero-globe-ring--1 {
          width: 108%;
          height: 108%;
          border-color: rgba(37, 99, 235, 0.1);
        }

        .hero-globe-ring--2 {
          width: 122%;
          height: 122%;
          border-style: dashed;
          border-color: rgba(37, 99, 235, 0.05);
        }

        .hero-globe-scan {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(96, 165, 250, 0.4),
            transparent
          );
          pointer-events: none;
          z-index: 3;
          opacity: 0.6;
        }

        .hero-globe :global(.globe-canvas) {
          width: 100%;
          height: 100%;
        }

        .hero-globe :global(.globe-canvas canvas) {
          width: 100% !important;
          height: 100% !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-globe-float,
          .hero-globe-glow,
          .hero-globe-ring,
          .hero-globe-scan {
            animation: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
