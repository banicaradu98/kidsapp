"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import UserAvatar from "@/app/components/UserAvatar";

interface Props {
  userId: string;
  initialAvatarUrl: string | null;
  initials: string;
}

export default function AvatarUpload({ userId, initialAvatarUrl, initials }: Props) {
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar is "custom" if it lives in our Supabase Storage bucket
  const isCustomAvatar = avatarUrl?.includes("/storage/v1/object/public/avatars/");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const path = `${userId}/avatar.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError("Eroare la upload. Încearcă din nou.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-busting so the browser loads the new image immediately
    const urlWithBust = `${publicUrl}?t=${Date.now()}`;

    await supabase.auth.updateUser({ data: { avatar_url: urlWithBust } });

    setAvatarUrl(urlWithBust);
    setUploading(false);
    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";
  }

  async function handleDelete() {
    if (!isCustomAvatar) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    await supabase.storage.from("avatars").remove([`${userId}/avatar.jpg`]);
    await supabase.auth.updateUser({ data: { avatar_url: null } });

    setAvatarUrl(null);
    setUploading(false);
  }

  return (
    <div className="flex flex-col items-center gap-2 shrink-0">
      <div className="relative">
        <UserAvatar avatarUrl={avatarUrl} initials={initials} size={80} />
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="text-xs font-bold text-[#ff5a2e] hover:underline disabled:opacity-50 transition-opacity"
      >
        Schimbă poza
      </button>

      {isCustomAvatar && (
        <button
          onClick={handleDelete}
          disabled={uploading}
          className="text-xs font-bold text-gray-400 hover:text-red-400 disabled:opacity-50 transition-colors"
        >
          Șterge poza
        </button>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
