"use client";

import { useEffect, useState } from "react";

const INTRO_KEY = "moosey_intro_seen";
const MASCOT = "/images/moosey_transparent.png";

type Mode = "pending" | "run" | "static";

export default function MascotHeroRun() {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    const seen = localStorage.getItem(INTRO_KEY);
    if (!seen) {
      localStorage.setItem(INTRO_KEY, "1");
      setMode("run");
      // After run animation finishes, transition to static position
      setTimeout(() => setMode("static"), 2600);
    } else {
      setMode("static");
    }
  }, []);

  if (mode === "pending") return null;

  // Running: fixed position so overflow-hidden on hero doesn't clip it
  if (mode === "run") {
    return (
      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          height: "160px",
          zIndex: 40,
          pointerEvents: "none",
        }}
      >
        <img
          src={MASCOT}
          alt="Moosey"
          className="mascot-run"
          style={{ height: "160px", width: "auto", objectFit: "contain" }}
        />
      </div>
    );
  }

  // Static: slide-in at bottom-right of hero
  return (
    <div className="absolute bottom-0 right-0 pointer-events-none">
      <img
        src={MASCOT}
        alt="Moosey"
        className="h-48 md:h-64 w-auto object-contain mascot-enter"
      />
    </div>
  );
}
