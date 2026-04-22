"use client";

import { useEffect, useState } from "react";

const MASCOT = "/images/moosey_transparent.png";
const COLORS = ["#ff5a2e", "#ffd700", "#4ade80", "#60a5fa", "#f472b6"];

interface Particle {
  id: number;
  color: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
  round: boolean;
}

function generateParticles(count = 40): Particle[] {
  // Use a seeded approach to avoid hydration issues — all random at component init time
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: COLORS[i % COLORS.length],
    left: (i * 2.5) % 100, // deterministic spread
    delay: (i * 0.04) % 1.5,
    duration: 1.5 + (i % 5) * 0.3,
    size: 6 + (i % 5) * 2,
    round: i % 2 === 0,
  }));
}

const PARTICLES = generateParticles();

/** Call from anywhere to trigger the celebration overlay */
export function triggerCelebration() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mascot-celebrate"));
  }
}

export default function MascotCelebration() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    function onCelebrate() {
      setActive(true);
      setTimeout(() => setActive(false), 2600);
    }
    window.addEventListener("mascot-celebrate", onCelebrate);
    return () => window.removeEventListener("mascot-celebrate", onCelebrate);
  }, []);

  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Confetti particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s both`,
          }}
        />
      ))}

      {/* Mascot jumping at bottom center */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={MASCOT}
          alt="Moosey"
          style={{
            height: "120px",
            width: "auto",
            objectFit: "contain",
            animation: "mascotJump 0.8s ease-in-out 3",
          }}
        />
      </div>
    </div>
  );
}
