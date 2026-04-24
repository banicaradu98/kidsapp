"use client";

import { useEffect, useState } from "react";

export default function MascotFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      onClick={scrollToTop}
      aria-label="Înapoi sus"
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 cursor-pointer bg-transparent border-0 p-0"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <img
        src="/images/moosey_transparent.png"
        alt="Moosey"
        className="h-14 md:h-20 w-auto object-contain mascot-float opacity-70 md:opacity-100"
      />
    </button>
  );
}
