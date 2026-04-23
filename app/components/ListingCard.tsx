import FavoriteButton from "./FavoriteButton";
import type { ReactNode } from "react";

function hl(text: string, q: string | undefined): ReactNode {
  if (!q?.trim()) return text;
  const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <mark key={i} className="bg-transparent text-[#ff5a2e] font-black not-italic">{p}</mark>
          : p
      )}
    </>
  );
}

export interface Listing {
  id: string;
  name: string;
  category: string | null;
  subcategory?: string | null;
  description: string | null;
  address: string | null;
  price: string | null;
  age_min: number | null;
  age_max: number | null;
  schedule: string | null;
  price_details?: string | null;
  is_verified?: boolean;
  images?: string[] | null;
  event_date?: string | null;
  event_end_date?: string | null;
  start_time?: string | null;
  hot_badge?: { type: string; label: string; emoji: string; bg: string; text: string } | null;
}

export function formatAge(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min == null) return `până la ${max} ani`;
  if (max == null) return `${min}+ ani`;
  return `${min}–${max} ani`;
}

export const CATEGORY_META: Record<string, { emoji: string; label: string; tagColor: string; gradientFrom: string; gradientTo: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Loc de joacă",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-50", gradientTo: "to-orange-100" },
  "educatie":     { emoji: "🎓", label: "Educație",        tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-50",  gradientTo: "to-green-100"  },
  "curs-atelier": { emoji: "🎨", label: "Curs & Atelier", tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-50", gradientTo: "to-purple-100" },
  "sport":        { emoji: "⚽", label: "Sport",          tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-50",    gradientTo: "to-sky-100"    },
  "spectacol":    { emoji: "🎭", label: "Spectacol",       tagColor: "bg-rose-100 text-rose-700",     gradientFrom: "from-rose-50",   gradientTo: "to-rose-100"   },
  "eveniment":    { emoji: "🎪", label: "Eveniment",       tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-50",   gradientTo: "to-pink-100"   },
};
export const DEFAULT_META = { emoji: "📍", label: "Activitate", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-50", gradientTo: "to-gray-100" };

export default function ListingCard({ listing, variant = "default", highlight }: { listing: Listing; variant?: "default" | "event"; highlight?: string }) {
  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
  const age = formatAge(listing.age_min, listing.age_max);
  const isFree = listing.price?.toLowerCase() === "gratuit";

  return (
    <div className="relative">
      <FavoriteButton listingId={listing.id} />
      <a
        href={`/listing/${listing.id}`}
        className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 overflow-hidden transition-all duration-300 active:scale-[.99] group"
      >
      {/* Thumb — 4:3 pe mobil, w-32 full-height pe desktop */}
      <div className="relative w-full aspect-[4/3] overflow-hidden sm:w-32 sm:shrink-0 sm:aspect-auto sm:h-auto">
        {listing.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={listing.images[0]}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} flex items-center justify-center`}>
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{meta.emoji}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`${meta.tagColor} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full`}>{meta.label}</span>
            {listing.is_verified && (
              <span className="bg-green-50 text-green-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">✓ Verificat</span>
            )}
            {listing.hot_badge && (
              <span className={`${listing.hot_badge.bg} ${listing.hot_badge.text} text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full`}>
                {listing.hot_badge.emoji} {listing.hot_badge.label}
              </span>
            )}
            {age && (
              <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">👶 {age}</span>
            )}
          </div>
          <h3 className="text-base font-bold text-[#1a1a2e] leading-snug">{hl(listing.name, highlight)}</h3>
          {listing.description && (
            <p className="text-sm text-gray-500 leading-relaxed mt-1 line-clamp-2">{hl(listing.description, highlight)}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-gray-50">
          <div className="flex flex-col gap-0.5">
            {listing.address && <span className="text-xs text-gray-400">📍 {listing.address}</span>}
            {variant === "event" && listing.schedule && (
              <span className="text-xs text-gray-400">📅 {listing.schedule}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {listing.price && (
              <span className={`font-display text-base font-bold ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>
                {listing.price}
              </span>
            )}
            <span className="text-xs font-semibold text-[#ff5a2e] border border-[#ff5a2e]/40 px-3 py-1.5 rounded-full hover:bg-[#fff5f3] transition-colors whitespace-nowrap">
              Vezi →
            </span>
          </div>
        </div>
      </div>
    </a>
    </div>
  );
}
