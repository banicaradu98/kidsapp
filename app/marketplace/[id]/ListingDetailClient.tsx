"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import MarketplaceCard, {
  type MarketplaceListing,
  timeAgo,
} from "../_components/MarketplaceCard";

// ── Types ──────────────────────────────────────────────────────────────────

type SellerProfile = {
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
};

type MarketplaceListingDetail = {
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
  phone: string | null;
  contact_preference: "phone" | "message" | "both" | null;
  age_recommendation: string | null;
  profiles: SellerProfile | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const TYPE_META: Record<string, { label: string; bg: string; text: string }> = {
  vand:      { label: "VÂND",      bg: "bg-[#ff5a2e]",   text: "text-white" },
  donez:     { label: "DONEZ",     bg: "bg-emerald-500", text: "text-white" },
  inchiriez: { label: "ÎNCHIRIEZ", bg: "bg-blue-500",    text: "text-white" },
};

const STATUS_BANNER: Record<string, { text: string; cls: string }> = {
  rezervat: { text: "Acest anunț este rezervat",    cls: "bg-amber-50 border-amber-200 text-amber-700" },
  vandut:   { text: "Acest anunț este marcat ca vândut", cls: "bg-gray-100 border-gray-200 text-gray-600" },
};

function formatPrice(listing: MarketplaceListingDetail): string | null {
  if (listing.type === "donez") return "Gratuit";
  if (listing.price == null) return null;
  const s = listing.price.toLocaleString("ro-RO") + " lei";
  return listing.type === "inchiriez" ? s + " / zi" : s;
}

function whatsappLink(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? "4" + digits : digits;
  return `https://wa.me/${intl}`;
}

function memberSince(dateStr: string | null): string {
  if (!dateStr) return "";
  return `Membru din ${new Date(dateStr).getFullYear()}`;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ListingDetailClient({
  listing,
  related,
}: {
  listing: MarketplaceListingDetail;
  related: MarketplaceListing[];
}) {
  const router = useRouter();
  const supabase = createClient();

  // Gallery
  const [currentImg, setCurrentImg] = useState(0);

  // Auth + favorites
  const [userId, setUserId] = useState<string | null>(null);
  const [isFav, setIsFav] = useState(false);
  const [favId, setFavId] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState(false);

  // Message
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  // Owner actions
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const typeMeta = TYPE_META[listing.type] ?? TYPE_META.vand;
  const priceDisplay = formatPrice(listing);
  const isOwner = !!userId && userId === listing.user_id;
  const banner = STATUS_BANNER[listing.status];

  // ── Auth + favorites check ─────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
      if (user) {
        supabase
          .from("marketplace_favorites")
          .select("id")
          .eq("listing_id", listing.id)
          .eq("user_id", user.id)
          .maybeSingle()
          .then(({ data }) => {
            setIsFav(!!data);
            setFavId(data?.id ?? null);
          });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  // ── Handlers ──────────────────────────────────────────────────────────

  async function handleFavorite() {
    if (!userId) { router.push("/?login=1"); return; }
    setFavLoading(true);
    if (isFav && favId) {
      await supabase.from("marketplace_favorites").delete().eq("id", favId);
      setIsFav(false);
      setFavId(null);
    } else {
      const { data } = await supabase
        .from("marketplace_favorites")
        .insert({ listing_id: listing.id, user_id: userId })
        .select("id")
        .single();
      setIsFav(true);
      setFavId(data?.id ?? null);
    }
    setFavLoading(false);
  }

  async function handleSendMessage() {
    if (!userId) { router.push("/?login=1"); return; }
    if (!message.trim()) return;
    setMessageLoading(true);
    await supabase.from("marketplace_messages").insert({
      listing_id: listing.id,
      sender_id: userId,
      receiver_id: listing.user_id,
      message: message.trim(),
    });
    setMessageSent(true);
    setMessageLoading(false);
    setMessage("");
  }

  async function handleStatusUpdate(status: string) {
    setStatusUpdating(true);
    await supabase
      .from("marketplace_listings")
      .update({ status })
      .eq("id", listing.id);
    setStatusUpdating(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Ești sigur că vrei să ștergi acest anunț? Acțiunea este ireversibilă.")) return;
    setDeleting(true);
    await supabase.from("marketplace_listings").delete().eq("id", listing.id);
    router.push("/marketplace");
  }

  // ── Render ─────────────────────────────────────────────────────────────

  const images = listing.images ?? [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Status banner */}
        {banner && (
          <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold ${banner.cls}`}>
            <span>{listing.status === "rezervat" ? "🔒" : "✅"}</span>
            {banner.text}
          </div>
        )}

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT — Gallery ── */}
          <div className="lg:col-span-3">
            {/* Main image */}
            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-sm relative">
              {hasImages ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[currentImg]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-300">
                  <span className="text-7xl">📦</span>
                  <span className="text-sm font-medium">Fără poze</span>
                </div>
              )}
              {/* Image counter */}
              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {currentImg + 1} / {images.length}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.slice(0, 3).map((url, i) => (
                  <button
                    key={url}
                    onClick={() => setCurrentImg(i)}
                    className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                      i === currentImg
                        ? "border-[#ff5a2e] shadow-sm"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT — Details ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`${typeMeta.bg} ${typeMeta.text} text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full`}>
                {typeMeta.label}
              </span>
              {listing.condition && (
                <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {listing.condition}
                </span>
              )}
              <span className="bg-[#fff5f3] text-[#ff5a2e] text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {listing.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a2e] leading-snug">
              {listing.title}
            </h1>

            {/* Price */}
            {priceDisplay && (
              <p className={`font-display text-3xl font-bold ${listing.type === "donez" ? "text-emerald-600" : "text-[#ff5a2e]"}`}>
                {priceDisplay}
              </p>
            )}

            {/* Age recommendation */}
            {listing.age_recommendation && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <span>👶</span> Vârstă recomandată: <strong className="text-gray-700">{listing.age_recommendation}</strong>
              </p>
            )}

            {/* Separator */}
            <div className="border-t border-gray-100" />

            {/* Description */}
            {listing.description && (
              <div>
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Descriere</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Separator */}
            <div className="border-t border-gray-100" />

            {/* Seller card */}
            <div className="flex items-center gap-3">
              {listing.profiles?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={listing.profiles.avatar_url}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#ff5a2e] flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold leading-none">
                    {(listing.profiles?.full_name ?? "V").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[#1a1a2e]">
                  {listing.profiles?.full_name ?? "Vânzător"}
                </p>
                {listing.profiles?.created_at && (
                  <p className="text-xs text-gray-400">{memberSince(listing.profiles.created_at)}</p>
                )}
              </div>
              <p className="ml-auto text-xs text-gray-400">{timeAgo(listing.created_at)}</p>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-100" />

            {/* ── CONTACT SECTION ── */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Contact</p>

              {/* Phone / WhatsApp */}
              {listing.phone &&
                (listing.contact_preference === "phone" || listing.contact_preference === "both") && (
                  <div className="flex gap-2">
                    <a
                      href={`tel:${listing.phone}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#2a2a3e] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                    >
                      📞 Sună
                    </a>
                    <a
                      href={whatsappLink(listing.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                )}

              {/* Message form */}
              {(listing.contact_preference === "message" || listing.contact_preference === "both") && (
                <div>
                  {messageSent ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                      <span>✅</span> Mesaj trimis! Vânzătorul te va contacta în curând.
                    </div>
                  ) : userId ? (
                    <div className="space-y-2">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Scrie un mesaj vânzătorului..."
                        rows={3}
                        className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-xl focus:border-[#ff5a2e] focus:outline-none resize-none placeholder-gray-400 transition-colors"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || messageLoading}
                        className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-50 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                      >
                        {messageLoading ? "Se trimite..." : "Trimite mesaj"}
                      </button>
                    </div>
                  ) : (
                    <a
                      href="/?login=1"
                      className="block w-full text-center border border-[#ff5a2e] text-[#ff5a2e] text-sm font-semibold py-3 rounded-xl hover:bg-[#fff5f3] transition-colors"
                    >
                      Autentifică-te pentru a trimite mesaj
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Favorite button */}
            {!isOwner && (
              <button
                onClick={handleFavorite}
                disabled={favLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isFav
                    ? "bg-[#fff5f3] border-[#ff5a2e] text-[#ff5a2e]"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
                }`}
              >
                <span>{isFav ? "♥" : "♡"}</span>
                {isFav ? "Salvat la favorite" : "Salvează la favorite"}
              </button>
            )}

            {/* ── OWNER ACTIONS ── */}
            {isOwner && (
              <div className="bg-[#f7f7f7] rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gestionează anunțul</p>
                {listing.status === "activ" && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate("rezervat")}
                      disabled={statusUpdating}
                      className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      🔒 Marchează ca rezervat
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("vandut")}
                      disabled={statusUpdating}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                    >
                      ✅ Marchează ca vândut
                    </button>
                  </>
                )}
                {listing.status !== "activ" && (
                  <button
                    onClick={() => handleStatusUpdate("activ")}
                    disabled={statusUpdating}
                    className="w-full flex items-center justify-center gap-2 bg-[#ff5a2e] hover:bg-[#f03d12] disabled:opacity-50 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    ▶ Reactivează anunțul
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {deleting ? "Se șterge..." : "🗑 Șterge anunțul"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED LISTINGS ── */}
        {related.length > 0 && (
          <div className="mt-14">
            <div className="mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a1a2e]">
                Alte anunțuri din aceeași categorie
              </h2>
              <p className="text-sm text-gray-400 mt-1">{listing.category}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((item) => (
                <MarketplaceCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
