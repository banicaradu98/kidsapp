"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/utils/supabase/auth";
import AuthModal from "./components/AuthModal";

const LINKS = [
  { icon: "🏠", label: "Acasă",              href: "/"                 },
  { icon: "🛝", label: "Playground",          href: "/locuri-de-joaca"  },
  { icon: "🎓", label: "Educație",           href: "/educatie"         },
  { icon: "🎨", label: "Cursuri & Ateliere", href: "/cursuri-ateliere" },
  { icon: "⚽", label: "Sport",             href: "/sport"            },
  { icon: "🎭", label: "Spectacole",         href: "/spectacole"       },
  { icon: "🎪", label: "Evenimente",         href: "/evenimente"       },
  { icon: "📅", label: "Calendar",           href: "/calendar"         },
  { icon: "🛍️", label: "Marketplace",        href: "/marketplace"      },
  { icon: "📩", label: "Newsletter",         href: "/#newsletter"      },
];

function MenuPanel({ onClose, user, onSignOut, onOpenAuth }: { onClose: () => void; user: User | null; onSignOut: () => void; onOpenAuth: () => void }) {
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
        <a href="/" onClick={onClose} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image src="/images/logo-moosey.png" alt="Moosey" width={120} height={40} style={{ height: 40, width: "auto", objectFit: "contain" }} />
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

      {/* Auth + CTA */}
      <div style={{ padding: "16px 20px", borderTop: "1px solid #f3f4f6", flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {user ? (
          <>
            <a
              href="/contul-meu"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#f9fafb",
                borderRadius: 14,
                textDecoration: "none",
                color: "#1a1a2e",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              👤 Contul meu
            </a>
            <a
              href="/favorite"
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#fff4f0",
                borderRadius: 14,
                textDecoration: "none",
                color: "#ff5a2e",
                fontWeight: 900,
                fontSize: 16,
              }}
            >
              ❤️ Favorite
            </a>
            <button
              onClick={onSignOut}
              style={{
                width: "100%",
                minHeight: 52,
                background: "#f3f4f6",
                color: "#6b7280",
                border: "none",
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Deconectare
            </button>
          </>
        ) : (
          <button
            onClick={() => { onClose(); onOpenAuth(); }}
            style={{
              width: "100%",
              minHeight: 52,
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: 14,
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Intră în cont
          </button>
        )}
        <a
          href="/adauga-locatia-ta"
          onClick={onClose}
          style={{
            display: "block",
            width: "100%",
            minHeight: 56,
            background: "#ff5a2e",
            color: "#ffffff",
            border: "none",
            borderRadius: 16,
            fontSize: 17,
            fontWeight: 900,
            cursor: "pointer",
            textAlign: "center",
            lineHeight: "56px",
            textDecoration: "none",
          }}
        >
          + Adaugă locația ta
        </a>
      </div>
    </div>
  );
}

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    // Read session from cookies immediately (set server-side after OAuth callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Keep listening for future sign-in / sign-out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await signOut();
    setOpen(false);
    window.location.reload();
  }

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
        <MenuPanel
          onClose={() => setOpen(false)}
          user={user}
          onSignOut={handleSignOut}
          onOpenAuth={() => setShowAuthModal(true)}
        />,
        document.body
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
