import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import AdminShell from "./_components/AdminShell";
import AdminListingsTable from "./_components/AdminListingsTable";


export default async function AdminDashboard() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, city, is_verified, is_featured, created_at")
    .order("created_at", { ascending: false });

  const items = listings ?? [];
  const pendingCount = items.filter((l) => !l.is_verified).length;

  // Count per category
  const counts: Record<string, number> = {};
  for (const l of items) {
    const cat = l.category ?? "altele";
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  return (
    <AdminShell>
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a2e]">Dashboard Admin</h1>
          <p className="text-gray-500 font-medium mt-0.5">Moosey</p>
        </div>
        <a
          href="/admin/nou"
          className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-5 py-3 rounded-xl transition-colors text-sm"
        >
          + Adaugă listing nou
        </a>
      </div>

      {/* Pending alert */}
      {pendingCount > 0 && (
        <a
          href="/admin/aprobare"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-6 hover:bg-amber-100 transition-colors"
        >
          <span className="text-2xl">⏳</span>
          <div className="flex-1">
            <p className="font-black text-amber-800">
              {pendingCount} listing{pendingCount === 1 ? "" : "uri"} în așteptare
            </p>
            <p className="text-sm text-amber-600 font-medium">
              Cereri trimise prin formularul public — necesită aprobare
            </p>
          </div>
          <span className="text-amber-600 font-bold text-sm">Verifică →</span>
        </a>
      )}

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
              {cat} · {n}
            </span>
          ))}
        </div>
      )}

      {/* Table with search + category filter */}
      <AdminListingsTable items={items} />
    </div>
    </AdminShell>
  );
}
