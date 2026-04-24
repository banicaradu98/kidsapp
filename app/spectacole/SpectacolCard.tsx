import { Listing, CATEGORY_META, DEFAULT_META } from "@/app/components/ListingCard";
import FavoriteButton from "@/app/components/FavoriteButton";
import { formatEventDate } from "@/utils/dateUtils";

function getVenueName(address: string | null): string | null {
  if (!address) return null;
  if (address.toLowerCase().includes("odobescu")) return "Teatrul Gong";
  return address.length > 30 ? address.slice(0, 28) + "…" : address;
}

export default function SpectacolCard({ listing }: { listing: Listing }) {
  const meta = CATEGORY_META[listing.category ?? ""] ?? DEFAULT_META;
  const dateDisplay = formatEventDate(listing.event_date, listing.event_end_date, listing.start_time);
  const isFree = listing.price?.toLowerCase() === "gratuit";
  const cover = listing.images?.[0];
  const venueName = getVenueName(listing.address);

  return (
    <a
      href={`/listing/${listing.id}`}
      className="relative flex bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-200 active:scale-[.99] group"
    >
      {/* Buton favorite — în afara imaginii, colț dreapta-sus al cardului */}
      <div className="absolute top-2 right-2 z-10">
        <FavoriteButton listingId={listing.id} />
      </div>

      {/* Thumbnail */}
      <div className="w-28 sm:w-36 shrink-0 overflow-hidden aspect-[3/4] sm:aspect-auto sm:h-auto">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.gradientFrom} ${meta.gradientTo} flex items-center justify-center`}>
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">{meta.emoji}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col gap-2 min-w-0 justify-between">
        <div className="flex flex-col gap-1.5">
          {/* Data */}
          {dateDisplay && (
            <div className="inline-flex flex-col gap-0.5 bg-[#ff5a2e]/10 text-[#ff5a2e] rounded-lg px-2.5 py-1 w-fit">
              <span className="text-xs font-black whitespace-nowrap">{dateDisplay.primary}</span>
              {dateDisplay.secondary && (
                <span className="text-[10px] font-bold whitespace-nowrap opacity-80">{dateDisplay.secondary}</span>
              )}
            </div>
          )}

          {/* Titlu */}
          <h3 className="text-sm sm:text-base font-black text-[#1a1a2e] leading-snug line-clamp-2">
            {listing.name}
          </h3>
        </div>

        <div className="flex items-end justify-between gap-2 flex-wrap">
          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {venueName && (
              <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                🎭 {venueName}
              </span>
            )}
            {listing.is_verified && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">✓</span>
            )}
          </div>

          {/* Preț */}
          {listing.price && (
            <span className={`text-base font-black shrink-0 ${isFree ? "text-green-600" : "text-[#ff5a2e]"}`}>
              {listing.price}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
