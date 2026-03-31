export interface Listing {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  address: string | null;
  price: string | null;
  age_min: number | null;
  age_max: number | null;
  schedule: string | null;
  is_verified?: boolean;
}

export function formatAge(min: number | null, max: number | null) {
  if (min == null && max == null) return null;
  if (min == null) return `până la ${max} ani`;
  if (max == null) return `${min}+ ani`;
  return `${min}–${max} ani`;
}

export const CATEGORY_META: Record<string, { emoji: string; label: string; tagColor: string; gradientFrom: string; gradientTo: string }> = {
  "loc-de-joaca": { emoji: "🛝", label: "Loc de joacă",   tagColor: "bg-orange-100 text-orange-700", gradientFrom: "from-orange-50", gradientTo: "to-orange-100" },
  "curs":         { emoji: "🎨", label: "Curs & Atelier", tagColor: "bg-purple-100 text-purple-700", gradientFrom: "from-purple-50", gradientTo: "to-purple-100" },
  "atelier":      { emoji: "🖌️", label: "Atelier",        tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-50",   gradientTo: "to-pink-100"   },
  "sport":        { emoji: "⚽", label: "Sport",          tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-50",  gradientTo: "to-green-100"  },
  "limbi-straine":{ emoji: "🌍", label: "Limbi străine",  tagColor: "bg-sky-100 text-sky-700",       gradientFrom: "from-sky-50",    gradientTo: "to-sky-100"    },
  "gradinita":    { emoji: "🌱", label: "Grădiniță",      tagColor: "bg-green-100 text-green-700",   gradientFrom: "from-green-50",  gradientTo: "to-green-100"  },
  "eveniment":    { emoji: "🎉", label: "Eveniment",      tagColor: "bg-pink-100 text-pink-700",     gradientFrom: "from-pink-50",   gradientTo: "to-pink-100"   },
};
export const DEFAULT_META = { emoji: "📍", label: "Activitate", tagColor: "bg-gray-100 text-gray-700", gradientFrom: "from-gray-50", gradientTo: "to-gray-100" };

export default function ListingCard({ listing, variant = "default" }: { listing: Listing; variant?: "default" | "event" }) {
  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
  const age = formatAge(listing.age_min, listing.age_max);
  const isFree = listing.price?.toLowerCase() === "gratuit";

  return (
    <a
      href={`/listing/${listing.id}`}
      className="flex flex-col sm:flex-row bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200 active:scale-[.99] group"
    >
      {/* Thumb */}
      <div className={`sm:w-32 sm:shrink-0 h-36 sm:h-auto bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} flex items-center justify-center`}>
        <span className="text-5xl group-hover:scale-110 transition-transform duration-200">{meta.emoji}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`${meta.tagColor} text-xs font-bold px-2.5 py-1 rounded-full`}>{meta.label}</span>
            {listing.is_verified && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">✓ Verificat</span>
            )}
            {age && (
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">👶 {age}</span>
            )}
          </div>
          <h3 className="text-base font-black text-[#1a1a2e] leading-snug">{listing.name}</h3>
          {listing.description && (
            <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1 line-clamp-2">{listing.description}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col gap-0.5">
            {listing.address && <span className="text-xs text-gray-400 font-semibold">📍 {listing.address}</span>}
            {variant === "event" && listing.schedule && (
              <span className="text-xs text-gray-400 font-semibold">📅 {listing.schedule}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {listing.price && (
              <span className={`text-base font-black ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>
                {listing.price}
              </span>
            )}
            <span className="text-sm font-bold text-[#ff5a2e] border border-[#ff5a2e] px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap">
              Vezi detalii →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
