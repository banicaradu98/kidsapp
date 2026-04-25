"use client";

import { useState } from "react";
import FavoriteButton from "@/app/components/FavoriteButton";

interface Props {
  images: string[];
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  title: string;
  listingId: string;
  isVerified: boolean;
  categoryLabel: string;
  categoryEmoji: string;
  categoryTagColor: string;
}

export default function ListingGallery({
  images, emoji, gradientFrom, gradientTo,
  title, listingId, isVerified, categoryLabel, categoryEmoji, categoryTagColor,
}: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const hasPhotos = images.length > 0;
  const cover = images[heroIndex] ?? images[0];

  function prev() {
    setLightbox((i) => (i! > 0 ? i! - 1 : images.length - 1));
  }
  function next() {
    setLightbox((i) => (i! < images.length - 1 ? i! + 1 : 0));
  }

  return (
    <>
      {/* ── FULL-BLEED HERO ── */}
      <div
        className="relative w-full bg-gray-50 overflow-hidden"
        style={{ maxHeight: "500px" }}
      >
        {hasPhotos ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt=""
              className="w-full object-contain cursor-pointer mx-auto block"
              style={{ maxHeight: "500px" }}
              onClick={() => setLightbox(heroIndex)}
            />
            {/* gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)" }}
            />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
            <span className="text-[100px] opacity-30">{emoji}</span>
          </div>
        )}

        {/* Category + verified badges — top left */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`${categoryTagColor} text-xs font-bold px-3 py-1.5 rounded-full shadow-sm`}>
            {categoryEmoji} {categoryLabel}
          </span>
          {isVerified && (
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              ✓ Verificat
            </span>
          )}
        </div>

        {/* Favorite button — top right */}
        <div className="absolute top-4 right-4">
          <FavoriteButton listingId={listingId} variant="hero" />
        </div>

        {/* Title — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 sm:px-8 sm:pb-7 pointer-events-none">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>
            {title}
          </h1>
        </div>

        {/* Photo count — bottom right */}
        {images.length > 1 && (
          <button
            onClick={() => setLightbox(heroIndex)}
            className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-black/60 transition-colors"
          >
            <span>📷</span> {images.length} fotografii
          </button>
        )}
      </div>

      {/* ── THUMBNAIL STRIP ── */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-1">
          {images.map((url, i) => (
            <button
              key={url}
              onClick={() => setHeroIndex(i)}
              className={`flex-none w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === heroIndex ? "border-[#ff5a2e]" : "border-transparent hover:border-gray-300"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center text-xl font-black transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Închide"
          >
            ×
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold">
            {lightbox + 1} / {images.length}
          </div>
          <div
            className="relative max-w-4xl w-full px-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightbox]}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center text-xl transition-colors"
                aria-label="Înapoi"
              >‹</button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/25 text-white rounded-full flex items-center justify-center text-xl transition-colors"
                aria-label="Înainte"
              >›</button>
            </>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === lightbox ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
