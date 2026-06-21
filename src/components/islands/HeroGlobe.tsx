import GlobeCanvas from "./GlobeCanvas";

export default function HeroGlobe() {
  return (
    <div className="hero-globe">
      <div className="hero-globe-glow" aria-hidden="true" />
      <div className="hero-globe-float">
        <GlobeCanvas />
      </div>
      <div className="hero-globe-ring hero-globe-ring--1" aria-hidden="true" />
      <div className="hero-globe-ring hero-globe-ring--2" aria-hidden="true" />
      <div className="hero-globe-scan" aria-hidden="true" />

      <style>{`
        .hero-globe {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hero-globe-enter 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
        }

        @keyframes hero-globe-enter {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .hero-globe-glow {
          position: absolute;
          width: 72%;
          height: 72%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(37, 99, 235, 0.4) 0%,
            rgba(37, 99, 235, 0.1) 50%,
            transparent 70%
          );
          pointer-events: none;
          z-index: 0;
          animation: hero-globe-pulse 5s ease-in-out infinite;
        }

        @keyframes hero-globe-pulse {
          0%,
          100% {
            opacity: 0.55;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.06);
          }
        }

        .hero-globe-float {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          animation: hero-globe-float 7s ease-in-out infinite;
        }

        @keyframes hero-globe-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-14px);
          }
        }

        .hero-globe-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(37, 99, 235, 0.12);
          pointer-events: none;
          z-index: 1;
        }

        .hero-globe-ring--1 {
          width: 108%;
          height: 108%;
          animation: hero-globe-spin 40s linear infinite;
        }

        .hero-globe-ring--2 {
          width: 122%;
          height: 122%;
          border-style: dashed;
          border-color: rgba(37, 99, 235, 0.07);
          animation: hero-globe-spin 55s linear infinite reverse;
        }

        @keyframes hero-globe-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .hero-globe-scan {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(96, 165, 250, 0.45),
            transparent
          );
          pointer-events: none;
          z-index: 3;
          opacity: 0.6;
          animation: hero-globe-scan 4s ease-in-out infinite;
        }

        @keyframes hero-globe-scan {
          0%,
          100% {
            top: 15%;
          }
          50% {
            top: 85%;
          }
        }

        .hero-globe :global(.globe-canvas) {
          width: 100%;
          height: 100%;
          min-height: inherit;
        }

        .hero-globe :global(.globe-canvas canvas) {
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-globe,
          .hero-globe-glow,
          .hero-globe-float,
          .hero-globe-ring,
          .hero-globe-scan {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
