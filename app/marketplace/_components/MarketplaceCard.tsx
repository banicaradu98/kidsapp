"use client";

import { useState } from "react";

export type MarketplaceListing = {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  type: "vand" | "donez" | "inchiriez";
  category: string;
  condition: string | null;
  images: string[];
  user_id: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "acum câteva secunde";
  if (mins < 60) return `acum ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `acum ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ieri";
  if (days < 7) return `acum ${days} zile`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `acum ${weeks} ${weeks === 1 ? "săptămână" : "săptămâni"}`;
  const months = Math.floor(days / 30);
  return `acum ${months} ${months === 1 ? "lună" : "luni"}`;
}

const TYPE_META: Record<string, { label: string; bg: string; text: string }> = {
  vand:      { label: "VÂND",      bg: "bg-[#ff5a2e]",    text: "text-white" },
  donez:     { label: "DONEZ",     bg: "bg-emerald-500",  text: "text-white" },
  inchiriez: { label: "ÎNCHIRIEZ", bg: "bg-blue-500",     text: "text-white" },
};

export default function MarketplaceCard({ listing }: { listing: MarketplaceListing }) {
  const [fav, setFav] = useState(false);

  const typeMeta = TYPE_META[listing.type] ?? TYPE_META.vand;
  const cover = listing.images?.[0];
  const sellerName = listing.profiles?.full_name ?? "Vânzător";
  const sellerAvatar = listing.profiles?.avatar_url;

  function formatPrice(): string | null {
    if (listing.type === "donez") return "Gratuit";
    if (listing.price == null) return null;
    const priceStr = listing.price.toLocaleString("ro-RO") + " lei";
    if (listing.type === "inchiriez") return priceStr + " / zi";
    return priceStr;
  }

  const priceDisplay = formatPrice();

  return (
    <a
      href={`/marketplace/${listing.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 block"
    >
      {/* ── IMAGE ── */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-5xl opacity-20">📦</span>
          </div>
        )}

        {/* Type badge — top left */}
        <span
          className={`absolute top-3 left-3 ${typeMeta.bg} ${typeMeta.text} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`}
        >
          {typeMeta.label}
        </span>

        {/* Condition badge — top right (leave room for heart) */}
        {listing.condition && (
          <span className="absolute top-3 right-11 bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            {listing.condition}
          </span>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setFav((f) => !f);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-150"
          aria-label={fav ? "Elimină din favorite" : "Adaugă la favorite"}
        >
          <span
            className="text-base leading-none select-none"
            style={{ color: fav ? "#ff5a2e" : "#9ca3af" }}
          >
            {fav ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#1a1a2e] leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
          {listing.title}
        </h3>

        {/* Price */}
        {priceDisplay && (
          <p
            className={`font-display text-lg font-bold mb-3 ${
              listing.type === "donez" ? "text-emerald-600" : "text-[#ff5a2e]"
            }`}
          >
            {priceDisplay}
          </p>
        )}

        {/* Seller + time */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 min-w-0">
            {sellerAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sellerAvatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#ff5a2e] flex items-center justify-center shrink-0">
                <span className="text-white text-[10px] font-bold leading-none">
                  {sellerName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-gray-500 truncate">{sellerName}</span>
          </div>
          <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </a>
  );
}
