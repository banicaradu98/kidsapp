"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "@/utils/supabase/auth";
import AuthModal from "./AuthModal";
import UserAvatar from "./UserAvatar";

export default function NavbarAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [hasDashboard, setHasDashboard] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    // Initial load: read session from cookies + check claims once
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (session?.user) {
        const { data } = await supabase
          .from("claims")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("status", "approved")
          .maybeSingle();
        setHasDashboard(!!data);
      }
    });

    // Only re-check claims on explicit SIGNED_IN (OAuth redirect) or clear on SIGNED_OUT.
    // Ignoring INITIAL_SESSION / TOKEN_REFRESHED to avoid race condition with getSession().
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
      if (event === "SIGNED_OUT") {
        setHasDashboard(false);
      } else if (event === "SIGNED_IN" && session?.user) {
        supabase
          .from("claims")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("status", "approved")
          .maybeSingle()
          .then(({ data }) => setHasDashboard(!!data));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    setShowDropdown(false);
    await signOut();
    window.location.href = "/";
  }

  // Invisible placeholder while resolving auth state (avoids layout shift)
  if (!ready) return <div className="hidden md:block w-28 h-9" />;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="hidden md:block border-2 border-gray-200 hover:border-[#ff5a2e]/50 text-gray-700 hover:text-[#ff5a2e] font-bold text-sm px-4 py-2 rounded-full transition-all whitespace-nowrap"
        >
          Intră în cont
        </button>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  const displayName: string =
    user.user_metadata?.full_name || user.email || "U";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative hidden md:block" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden hover:opacity-90 transition-opacity shrink-0"
        aria-label="Contul meu"
        title={displayName}
      >
        <UserAvatar avatarUrl={user.user_metadata?.avatar_url} initials={initials} size={36} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-2xl shadow-xl w-48 py-2 z-[200]">
          <p className="px-4 pt-1 pb-2 text-xs font-bold text-gray-400 truncate">
            {user.email}
          </p>
          <div className="border-t border-gray-100 mb-1" />
          <a
            href="/contul-meu"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5a2e] transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            👤 Contul meu
          </a>
          <a
            href="/favorite"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5a2e] transition-colors"
            onClick={() => setShowDropdown(false)}
          >
            ❤️ Favorite
          </a>
          {hasDashboard && (
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-orange-50 hover:text-[#ff5a2e] transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              📊 Dashboard locație
            </a>
          )}
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Deconectare
          </button>
        </div>
      )}
    </div>
  );
}
