"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MASCOT = "/images/moosey_transparent.png";

export default function MascotProgressBar() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  // Detect link clicks → start progress animation
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel")) return;
      // Internal navigation — start bar
      clearTimeout(hideTimer.current);
      setVisible(true);
      setProgress(5);
      setTimeout(() => setProgress(70), 80);
    }
    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // Detect route completion
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    // Route changed → complete bar then hide
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 450);
    return () => clearTimeout(hideTimer.current);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: "none" }}
    >
      {/* Bar */}
      <div
        style={{
          height: "4px",
          background: "#ff5a2e",
          width: `${progress}%`,
          transition: "width 0.3s ease-out",
          boxShadow: "0 0 8px rgba(255,90,46,0.5)",
        }}
      />
      {/* Mascot riding the bar */}
      <div
        style={{
          position: "absolute",
          top: "-18px",
          left: `${progress}%`,
          transform: "translateX(-50%)",
          transition: "left 0.3s ease-out",
        }}
      >
        <img
          src={MASCOT}
          alt=""
          style={{
            height: "40px",
            width: "auto",
            objectFit: "contain",
            animation: "mascotWalk 0.4s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
