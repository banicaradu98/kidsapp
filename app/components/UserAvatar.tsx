"use client";

import { useState } from "react";

interface Props {
  avatarUrl?: string | null;
  initials: string;
  size: number;
}

export default function UserAvatar({ avatarUrl, initials, size }: Props) {
  const [imgError, setImgError] = useState(false);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={initials}
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-[#ff5a2e] flex items-center justify-center text-white font-black"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.35) }}
    >
      {initials}
    </div>
  );
}
