"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LINKS = [
  { icon: "🏠", label: "Acasă",              href: "/"                 },
  { icon: "🛝", label: "Locuri de joacă",    href: "/locuri-de-joaca"  },
  { icon: "🎓", label: "Educație",           href: "/educatie"         },
  { icon: "🎨", label: "Cursuri & Ateliere", href: "/cursuri-ateliere" },
  { icon: "⚽", label: "Sport",             href: "/sport"            },
  { icon: "🎭", label: "Spectacole",         href: "/spectacole"       },
  { icon: "🎪", label: "Evenimente",         href: "/evenimente"       },
  { icon: "📩", label: "Newsletter",         href: "/#newsletter"      },
];

function MenuPanel({ onClose }: { onClose: () => void }) {
  // Blochează scroll body
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 99999,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Nunito, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        height: 64,
        borderBottom: "1px solid #f3f4f6",
        flexShrink: 0,
      }}>
        <a href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 24 }}>🧡</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: "#ff5a2e" }}>KidsApp</span>
        </a>
        <button
          onClick={onClose}
          aria-label="Închide meniu"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: "#f3f4f6",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            color: "#374151",
          }}
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <nav style={{ flex: 1, overflowY: "auto" }}>
        {LINKS.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 24px",
              minHeight: 64,
              fontSize: 18,
              fontWeight: 700,
              color: "#1a1a2e",
              textDecoration: "none",
              borderBottom: "1px solid #f3f4f6",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#fff4f0")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 24, width: 36, textAlign: "center" }}>{icon}</span>
            {label}
          </a>
        ))}
      </nav>

      {/* CTA */}
      <div style={{ padding: "20px 20px", borderTop: "1px solid #f3f4f6", flexShrink: 0 }}>
        <button
          onClick={onClose}
          style={{
            width: "100%",
            minHeight: 56,
            background: "#ff5a2e",
            color: "#ffffff",
            border: "none",
            borderRadius: 16,
            fontSize: 17,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          + Adaugă locația ta
        </button>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Deschide meniu"
        className="md:hidden flex flex-col items-center justify-center w-11 h-11 rounded-xl hover:bg-gray-100 transition-colors gap-[5px]"
      >
        <span className="block w-[22px] h-[2px] bg-gray-700 rounded-full" />
        <span className="block w-[22px] h-[2px] bg-gray-700 rounded-full" />
        <span className="block w-[14px] h-[2px] bg-gray-700 rounded-full self-start ml-1" />
      </button>

      {/* Portal — montat direct în document.body */}
      {mounted && open && createPortal(
        <MenuPanel onClose={() => setOpen(false)} />,
        document.body
      )}
    </>
  );
}
