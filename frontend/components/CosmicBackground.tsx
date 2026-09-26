"use client";

import React, { useMemo } from "react";

export default function CosmicBackground() {
  // Pre-generate deterministic stars so SSR hydration matches client
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      // Deterministic pseudo-random values based on index
      const top = ((i * 37 + 13) % 100);
      const left = ((i * 61 + 29) % 100);
      const size = (i % 3 === 0 ? 2.5 : (i % 2 === 0 ? 1.5 : 1));
      const opacity = (0.25 + ((i % 5) * 0.15));
      const duration = 2.5 + ((i % 4) * 1.2);
      const delay = (i % 5) * 0.8;

      return { id: i, top, left, size, opacity, duration, delay };
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        backgroundColor: "#05040a",
        pointerEvents: "none",
      }}
    >
      {/* Deep Space Ambient Nebulae */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "70vw",
          height: "70vw",
          minWidth: "600px",
          minHeight: "600px",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(91, 33, 182, 0.12) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          left: "-10%",
          width: "50vw",
          height: "50vw",
          minWidth: "400px",
          minHeight: "400px",
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.08) 0%, rgba(76, 29, 149, 0.04) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
      />

      {/* Star Field */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: "absolute",
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite alternate`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 2 ? "0 0 6px rgba(255, 255, 255, 0.8)" : "none",
          }}
        />
      ))}

      {/* Celestial Crescent Planet Body */}
      <div
        style={{
          position: "absolute",
          top: "clamp(-180px, -12vw, -80px)",
          right: "clamp(-260px, -14vw, -120px)",
          width: "clamp(550px, 58vw, 880px)",
          height: "clamp(550px, 58vw, 880px)",
          borderRadius: "50%",
          // Base shadowed sphere with subtle rim gradient
          background: "radial-gradient(circle at 65% 50%, #0d0a1b 0%, #070510 65%, #05040a 100%)",
          // Complex outer glow matching the purple/magenta planetary atmosphere
          boxShadow: `
            -25px 25px 90px -10px rgba(168, 85, 247, 0.45),
            -10px 10px 45px 0px rgba(236, 72, 153, 0.35),
            inset 8px -8px 25px rgba(255, 255, 255, 0.05)
          `,
          animation: "pulseGlow 8s ease-in-out infinite",
        }}
      >
        {/* Crescent Light Overlay (SVG for mathematically crisp curvature & gradient) */}
        <svg
          viewBox="0 0 1000 1000"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {/* Smooth purple to vibrant magenta/violet gradient along crescent rim */}
            <linearGradient id="crescentRimGrad" x1="0%" y1="30%" x2="40%" y2="90%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="15%" stopColor="#f0abfc" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#c084fc" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#9333ea" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.2" />
            </linearGradient>

            <radialGradient id="rimFlareGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#f472b6" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#a855f7" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>

            <filter id="crescentBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="30" />
            </filter>
          </defs>

          {/* Planetary Crescent Rim (Smooth outer edge, darkened inner edge) */}
          {/* Deep ambient glow layer */}
          <path
            d="M 500,20 A 480,480 0 0,0 20,500 A 480,480 0 0,0 500,980 A 420,440 0 0,1 180,500 A 420,440 0 0,1 500,20 Z"
            fill="url(#crescentRimGrad)"
            filter="url(#softGlow)"
            opacity="0.7"
          />

          {/* Crisp, intense crescent band */}
          <path
            d="M 500,30 A 470,470 0 0,0 30,500 A 470,470 0 0,0 500,970 A 435,450 0 0,1 160,500 A 435,450 0 0,1 500,30 Z"
            fill="url(#crescentRimGrad)"
            opacity="0.85"
          />

          {/* Core bright light edge */}
          <path
            d="M 500,35 A 465,465 0 0,0 35,500 A 465,465 0 0,0 500,965"
            fill="none"
            stroke="url(#crescentRimGrad)"
            strokeWidth="10"
            filter="url(#crescentBlur)"
            opacity="0.9"
          />
        </svg>

        {/* Luminous Rim Flare / Flash Light Burst */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "2%",
            width: "220px",
            height: "220px",
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.98) 0%, rgba(244, 114, 182, 0.85) 20%, rgba(168, 85, 247, 0.5) 50%, transparent 75%)",
            borderRadius: "50%",
            filter: "blur(14px)",
            animation: "flareShift 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />

        {/* Subtle secondary light ray pointing toward the card */}
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "2%",
            width: "400px",
            height: "80px",
            transform: "translate(-85%, -40%) rotate(-18deg)",
            background: "linear-gradient(90deg, transparent 0%, rgba(192, 132, 252, 0.25) 50%, rgba(255, 255, 255, 0.7) 100%)",
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
