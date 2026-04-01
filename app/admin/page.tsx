import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { deleteListing } from "./actions";
import DeleteButton from "./_components/DeleteButton";

const CATEGORY_LABELS: Record<string, string> = {
  "loc-de-joaca":  "🛝 Loc de joacă",
  "curs":          "🎨 Curs",
  "atelier":       "🖌️ Atelier",
  "gradinita":     "🌱 Grădiniță",
  "cresa":         "🍼 Creșă",
  "after-school":  "📚 After School",
  "sport":         "⚽ Sport",
  "spectacol":     "🎭 Spectacol",
  "eveniment":     "🎉 Eveniment",
  "limbi-straine": "🌍 Limbi străine",
};

export default async function AdminDashboard() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, city, is_verified, is_featured, created_at")
    .order("created_at", { ascending: false });

  const items = listings ?? [];

  // Count per category
  const counts: Record<string, number> = {};
  for (const l of items) {
    const cat = l.category ?? "altele";
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Dashboard Admin</h1>
          <p className="text-gray-500 font-medium mt-0.5">KidsApp Sibiu</p>
        </div>
        <a
          href="/admin/nou"
          className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-5 py-3 rounded-xl transition-colors text-sm"
        >
          + Adaugă listing nou
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 mb-1">Total listinguri</p>
          <p className="text-3xl font-black text-[#ff5a2e]">{items.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 mb-1">Verificate</p>
          <p className="text-3xl font-black text-green-600">{items.filter(l => l.is_verified).length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 mb-1">Recomandate</p>
          <p className="text-3xl font-black text-purple-600">{items.filter(l => l.is_featured).length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-xs font-bold text-gray-400 mb-1">Categorii active</p>
          <p className="text-3xl font-black text-sky-600">{Object.keys(counts).length}</p>
        </div>
      </div>

      {/* Per category */}
      {Object.keys(counts).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([cat, n]) => (
            <span key={cat} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-full">
              {CATEGORY_LABELS[cat] ?? cat} · {n}
            </span>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-800">Toate listingurile</h2>
          <span className="text-sm text-gray-400 font-medium">{items.length} total</span>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold text-gray-500">Niciun listing adăugat încă.</p>
            <a href="/admin/nou" className="inline-block mt-4 text-sm font-bold text-[#ff5a2e] hover:underline">
              Adaugă primul listing →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-bold text-gray-500">Nume</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500">Categorie</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-500">Oraș</th>
                  <th className="text-center px-4 py-3 font-bold text-gray-500">Verificat</th>
                  <th className="text-center px-4 py-3 font-bold text-gray-500">Featured</th>
                  <th className="text-right px-5 py-3 font-bold text-gray-500">Acțiuni</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => {
                  const deleteWithId = deleteListing.bind(null, l.id);
                  return (
                    <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[200px] truncate">
                        {l.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {CATEGORY_LABELS[l.category ?? ""] ?? l.category ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">{l.city ?? "—"}</td>
                      <td className="px-4 py-3.5 text-center">
                        {l.is_verified ? <span className="text-green-500 font-bold">✓</span> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {l.is_featured ? <span className="text-purple-500 font-bold">⭐</span> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <a
                          href={`/admin/edit/${l.id}`}
                          className="text-sm font-bold text-[#ff5a2e] hover:underline mr-2"
                        >
                          Edit
                        </a>
                        <DeleteButton action={deleteWithId} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
