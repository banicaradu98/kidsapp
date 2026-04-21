"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import MarketplaceCard, {
  type MarketplaceListing,
  timeAgo,
} from "@/app/marketplace/_components/MarketplaceCard";

// ── Types ──────────────────────────────────────────────────────────────────

type MyListing = {
  id: string;
  title: string;
  images: string[];
  status: string;
  type: string;
  price: number | null;
  created_at: string;
};

type Message = {
  id: string;
  listing_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  read: boolean;
  created_at: string;
  marketplace_listings: {
    id: string;
    title: string;
    images: string[];
    user_id: string;
  } | null;
};

type Conversation = {
  listingId: string;
  listingTitle: string;
  listingImage: string | null;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
};

type FavoriteItem = {
  id: string;
  listing_id: string;
  marketplace_listings: MarketplaceListing | null;
};

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  activ:    "bg-emerald-100 text-emerald-700",
  rezervat: "bg-amber-100  text-amber-700",
  vandut:   "bg-gray-100   text-gray-500",
};
const STATUS_LABEL: Record<string, string> = {
  activ: "Activ", rezervat: "Rezervat", vandut: "Vândut",
};

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

// ── Main component ─────────────────────────────────────────────────────────

export default function MarketplaceDashboard({ userId }: { userId: string }) {
  const [sub, setSub] = useState<"anunturi" | "mesaje" | "favorite">("anunturi");

  // ── ANUNȚURI ───────────────────────────────────────────────────────────

  const [listings, setListings] = useState<MyListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsFetched, setListingsFetched] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setListingsLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("marketplace_listings")
      .select("id, title, images, status, type, price, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setListings((data as MyListing[]) ?? []);
    setListingsLoading(false);
    setListingsFetched(true);
  }, [userId]);

  useEffect(() => {
    if (sub === "anunturi" && !listingsFetched) fetchListings();
  }, [sub, listingsFetched, fetchListings]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("marketplace_listings").update({ status }).eq("id", id);
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setUpdatingId(null);
  }

  async function deleteListing(id: string) {
    if (!confirm("Ești sigur că vrei să ștergi anunțul?")) return;
    setDeletingId(id);
    const supabase = createClient();
    await supabase.from("marketplace_listings").delete().eq("id", id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeletingId(null);
  }

  // ── MESAJE ─────────────────────────────────────────────────────────────

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesFetched, setMessagesFetched] = useState(false);
  const [expandedConv, setExpandedConv] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("marketplace_messages")
      .select("*, marketplace_listings(id, title, images, user_id)")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true });

    const msgs = (data as Message[]) ?? [];

    // Group by listing_id
    const convMap = new Map<string, Conversation>();
    for (const msg of msgs) {
      const key = msg.listing_id;
      if (!convMap.has(key)) {
        convMap.set(key, {
          listingId: msg.listing_id,
          listingTitle: msg.marketplace_listings?.title ?? "Anunț șters",
          listingImage: msg.marketplace_listings?.images?.[0] ?? null,
          messages: [],
          lastMessage: msg,
          unreadCount: 0,
        });
      }
      const conv = convMap.get(key)!;
      conv.messages.push(msg);
      if (!msg.read && msg.receiver_id === userId) conv.unreadCount++;
      if (new Date(msg.created_at) > new Date(conv.lastMessage.created_at)) {
        conv.lastMessage = msg;
      }
    }

    const sorted = Array.from(convMap.values()).sort(
      (a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );

    setConversations(sorted);
    setTotalUnread(sorted.reduce((s, c) => s + c.unreadCount, 0));
    setMessagesLoading(false);
    setMessagesFetched(true);
  }, [userId]);

  useEffect(() => {
    if (sub === "mesaje" && !messagesFetched) fetchMessages();
  }, [sub, messagesFetched, fetchMessages]);

  async function openConversation(listingId: string) {
    const isOpen = expandedConv === listingId;
    setExpandedConv(isOpen ? null : listingId);

    if (!isOpen) {
      // Mark messages as read
      const supabase = createClient();
      await supabase
        .from("marketplace_messages")
        .update({ read: true })
        .eq("listing_id", listingId)
        .eq("receiver_id", userId)
        .eq("read", false);

      setConversations((prev) =>
        prev.map((c) =>
          c.listingId === listingId
            ? {
                ...c,
                unreadCount: 0,
                messages: c.messages.map((m) =>
                  m.receiver_id === userId ? { ...m, read: true } : m
                ),
              }
            : c
        )
      );
      setTotalUnread((n) => Math.max(0, n - (conversations.find((c) => c.listingId === listingId)?.unreadCount ?? 0)));
    }
  }

  async function sendReply(listingId: string, receiverId: string) {
    const text = (replyText[listingId] ?? "").trim();
    if (!text) return;
    setSendingReply(true);
    const supabase = createClient();
    const { data: newMsg } = await supabase
      .from("marketplace_messages")
      .insert({
        listing_id: listingId,
        sender_id: userId,
        receiver_id: receiverId,
        message: text,
        read: false,
      })
      .select()
      .single();

    if (newMsg) {
      setConversations((prev) =>
        prev.map((c) =>
          c.listingId === listingId
            ? { ...c, messages: [...c.messages, newMsg as Message], lastMessage: newMsg as Message }
            : c
        )
      );
    }
    setReplyText((prev) => ({ ...prev, [listingId]: "" }));
    setSendingReply(false);
  }

  // ── FAVORITE ───────────────────────────────────────────────────────────

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favLoading, setFavLoading] = useState(false);
  const [favFetched, setFavFetched] = useState(false);
  const [removingFavId, setRemovingFavId] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setFavLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("marketplace_favorites")
      .select("id, listing_id, marketplace_listings(*, profiles(full_name, avatar_url))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setFavorites((data as unknown as FavoriteItem[]) ?? []);
    setFavLoading(false);
    setFavFetched(true);
  }, [userId]);

  useEffect(() => {
    if (sub === "favorite" && !favFetched) fetchFavorites();
  }, [sub, favFetched, fetchFavorites]);

  async function removeFavorite(favId: string) {
    setRemovingFavId(favId);
    const supabase = createClient();
    await supabase.from("marketplace_favorites").delete().eq("id", favId);
    setFavorites((prev) => prev.filter((f) => f.id !== favId));
    setRemovingFavId(null);
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Sub-tab bar */}
      <div className="flex gap-1.5 mb-5">
        {[
          { id: "anunturi" as const, label: "📦 Anunțurile mele" },
          { id: "mesaje"   as const, label: `💬 Mesaje${totalUnread > 0 ? ` (${totalUnread})` : ""}` },
          { id: "favorite" as const, label: "🛍️ Favorite" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSub(t.id)}
            className={`flex-1 sm:flex-none text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl border transition-all duration-150 ${
              sub === t.id
                ? "bg-[#ff5a2e] text-white border-[#ff5a2e]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ANUNȚURI ── */}
      {sub === "anunturi" && (
        <div>
          <div className="flex justify-end mb-4">
            <a
              href="/marketplace/adauga"
              className="inline-flex items-center gap-1.5 bg-[#ff5a2e] hover:bg-[#f03d12] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              + Adaugă anunț nou
            </a>
          </div>

          {listingsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">📦</p>
              <p className="font-semibold text-gray-600 mb-1">Nu ai niciun anunț</p>
              <p className="text-sm text-gray-400 mb-5">Adaugă primul tău anunț în marketplace</p>
              <a
                href="/marketplace/adauga"
                className="inline-block bg-[#ff5a2e] text-white font-semibold px-6 py-2.5 rounded-full text-sm"
              >
                + Adaugă anunț
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map((l) => (
                <div key={l.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <a href={`/marketplace/${l.id}`} className="shrink-0">
                    {l.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={l.images[0]} alt="" className="w-16 h-16 object-cover rounded-xl" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">📦</div>
                    )}
                  </a>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <a href={`/marketplace/${l.id}`} className="font-semibold text-[#1a1a2e] text-sm line-clamp-1 hover:text-[#ff5a2e] transition-colors">
                      {l.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLE[l.status] ?? "bg-gray-100 text-gray-500"}`}>
                        {STATUS_LABEL[l.status] ?? l.status}
                      </span>
                      <span className="text-[11px] text-gray-400">{formatDateShort(l.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    {l.status === "activ" && (
                      <>
                        <button
                          onClick={() => updateStatus(l.id, "rezervat")}
                          disabled={updatingId === l.id}
                          className="text-[11px] font-semibold text-amber-600 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          Rezervat
                        </button>
                        <button
                          onClick={() => updateStatus(l.id, "vandut")}
                          disabled={updatingId === l.id}
                          className="text-[11px] font-semibold text-emerald-600 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          Vândut
                        </button>
                      </>
                    )}
                    {l.status !== "activ" && (
                      <button
                        onClick={() => updateStatus(l.id, "activ")}
                        disabled={updatingId === l.id}
                        className="text-[11px] font-semibold text-[#ff5a2e] border border-orange-200 bg-[#fff5f3] hover:bg-orange-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Reactivează
                      </button>
                    )}
                    <button
                      onClick={() => deleteListing(l.id)}
                      disabled={deletingId === l.id}
                      className="text-[11px] font-semibold text-red-500 border border-red-100 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === l.id ? "..." : "Șterge"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MESAJE ── */}
      {sub === "mesaje" && (
        <div>
          {messagesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">💬</p>
              <p className="font-semibold text-gray-600 mb-1">Nu ai niciun mesaj</p>
              <p className="text-sm text-gray-400">Mesajele cu vânzătorii vor apărea aici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conv) => {
                const isOpen = expandedConv === conv.listingId;
                const otherMsgs = conv.messages.filter((m) => m.receiver_id === userId || m.sender_id === userId);
                const receiverId = conv.messages.find((m) => m.sender_id !== userId)?.sender_id
                  ?? conv.messages[0]?.receiver_id ?? "";

                return (
                  <div key={conv.listingId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    {/* Conversation header */}
                    <button
                      onClick={() => openConversation(conv.listingId)}
                      className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      {conv.listingImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={conv.listingImage} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">📦</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#1a1a2e] truncate">{conv.listingTitle}</p>
                          {conv.unreadCount > 0 && (
                            <span className="shrink-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage.message}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo(conv.lastMessage.created_at)}</p>
                      </div>
                      <span className="text-gray-400 text-sm shrink-0">{isOpen ? "▲" : "▼"}</span>
                    </button>

                    {/* Thread */}
                    {isOpen && (
                      <div className="border-t border-gray-100">
                        {/* Messages */}
                        <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
                          {otherMsgs.map((msg) => {
                            const isMine = msg.sender_id === userId;
                            return (
                              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    isMine
                                      ? "bg-[#ff5a2e] text-white rounded-br-sm"
                                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                                  }`}
                                >
                                  <p>{msg.message}</p>
                                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/70" : "text-gray-400"}`}>
                                    {timeAgo(msg.created_at)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Reply form */}
                        <div className="p-3 border-t border-gray-100 flex gap-2">
                          <textarea
                            value={replyText[conv.listingId] ?? ""}
                            onChange={(e) => setReplyText((prev) => ({ ...prev, [conv.listingId]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendReply(conv.listingId, receiverId);
                              }
                            }}
                            placeholder="Scrie un răspuns..."
                            rows={1}
                            className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-xl focus:border-[#ff5a2e] focus:outline-none resize-none placeholder-gray-400"
                          />
                          <button
                            onClick={() => sendReply(conv.listingId, receiverId)}
                            disabled={!replyText[conv.listingId]?.trim() || sendingReply}
                            className="bg-[#ff5a2e] disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                          >
                            Trimite
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── FAVORITE MARKETPLACE ── */}
      {sub === "favorite" && (
        <div>
          {favLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">🛍️</p>
              <p className="font-semibold text-gray-600 mb-1">Niciun anunț salvat</p>
              <p className="text-sm text-gray-400 mb-5">Explorează marketplace-ul și salvează anunțurile care te interesează</p>
              <a
                href="/marketplace"
                className="inline-block bg-[#ff5a2e] text-white font-semibold px-6 py-2.5 rounded-full text-sm"
              >
                Explorează marketplace →
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((fav) =>
                fav.marketplace_listings ? (
                  <div key={fav.id} className="relative">
                    <MarketplaceCard listing={fav.marketplace_listings} />
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      disabled={removingFavId === fav.id}
                      className="absolute bottom-[72px] right-3 text-[11px] font-semibold text-red-500 bg-white border border-red-100 hover:bg-red-50 px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 shadow-sm"
                    >
                      {removingFavId === fav.id ? "..." : "× Elimină"}
                    </button>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
