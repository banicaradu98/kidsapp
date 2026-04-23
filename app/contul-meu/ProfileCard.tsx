"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import AvatarUpload from "./AvatarUpload";

interface ReviewLevel {
  label: string;
  emoji: string;
  bg: string;
  text: string;
}

interface Props {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  initials: string;
  totalFavorites: number;
  reviewCount: number;
  reviewLevel: ReviewLevel | null;
  memberSince: string;
}

export default function ProfileCard({
  userId, displayName, email, avatarUrl, initials,
  totalFavorites, reviewCount, reviewLevel, memberSince,
}: Props) {
  const [name, setName] = useState(displayName);
  const [editMode, setEditMode] = useState(false);
  const [inputVal, setInputVal] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function saveName() {
    const trimmed = inputVal.trim();
    if (!trimmed || trimmed === name) { setEditMode(false); return; }
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: trimmed } });
    if (!error) {
      await supabase.from("profiles").update({ full_name: trimmed }).eq("id", userId);
      setName(trimmed);
      setEditMode(false);
    } else {
      setSaveError("Nu s-a putut salva. Încearcă din nou.");
    }
    setSaving(false);
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start gap-5">
        <AvatarUpload
          userId={userId}
          initialAvatarUrl={avatarUrl}
          initials={initials}
        />

        <div className="flex-1 min-w-0">
          {editMode ? (
            <div className="flex flex-col gap-2 mb-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditMode(false); }}
                autoFocus
                className="text-xl font-black text-[#1a1a2e] border-b-2 border-[#ff5a2e] outline-none bg-transparent w-full pb-0.5"
                placeholder="Numele tău complet"
              />
              {saveError && <p className="text-xs text-red-500 font-semibold">{saveError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={saveName}
                  disabled={saving}
                  className="text-xs font-black bg-[#ff5a2e] hover:bg-[#f03d12] text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? "Se salvează..." : "Salvează"}
                </button>
                <button
                  onClick={() => { setEditMode(false); setInputVal(name); }}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Anulează
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-xl font-black text-[#1a1a2e] leading-tight truncate">{name}</h1>
              <button
                onClick={() => { setEditMode(true); setInputVal(name); }}
                className="text-xs font-bold text-gray-400 hover:text-[#ff5a2e] transition-colors shrink-0"
                title="Editează numele"
              >
                ✏️
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 font-medium truncate">{email}</p>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Membru din {memberSince}</p>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <span className="text-red-400">❤️</span> {totalFavorites} favorite
            </span>
            <span className="text-gray-200 text-xs">·</span>
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
              <span className="text-yellow-400">⭐</span> {reviewCount} recenzii
            </span>
            {reviewLevel && (
              <>
                <span className="text-gray-200 text-xs">·</span>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${reviewLevel.bg} ${reviewLevel.text}`}>
                  {reviewLevel.emoji} {reviewLevel.label}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
