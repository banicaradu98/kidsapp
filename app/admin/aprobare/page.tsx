import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { approveListing, rejectListing } from "../actions";
import DeleteButton from "../_components/DeleteButton";
import AdminShell from "../_components/AdminShell";

const CATEGORY_LABELS: Record<string, string> = {
  "loc-de-joaca":  "🛝 Loc de joacă",
  "educatie":      "🎓 Educație",
  "curs-atelier":  "🎨 Curs & Atelier",
  "sport":         "⚽ Sport",
  "spectacol":     "🎭 Spectacol",
  "eveniment":     "🎪 Eveniment",
};

export default async function AprobarePage() {
  const supabase = createClient(await cookies());
  const { data: listings } = await supabase
    .from("listings")
    .select("id, name, category, city, description, phone, website, contact_name, contact_email, created_at, address")
    .eq("is_verified", false)
    .order("created_at", { ascending: true });

  const pending = listings ?? [];

  return (
    <AdminShell>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-black text-[#1a1a2e]">Spre aprobare</h1>
          <p className="text-gray-500 font-medium mt-0.5">
            {pending.length === 0
              ? "Nicio cerere în așteptare."
              : `${pending.length} listing${pending.length === 1 ? "" : "uri"} în așteptare`}
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <p className="text-4xl mb-3">✅</p>
            <p className="font-bold text-gray-500">Toate cererile au fost procesate!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((l) => {
              const approveWithId = approveListing.bind(null, l.id);
              const rejectWithId  = rejectListing.bind(null, l.id);
              return (
                <div key={l.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="bg-amber-100 text-amber-700 text-xs font-black px-2.5 py-1 rounded-full">
                          ⏳ În așteptare
                        </span>
                        <span className="text-xs font-semibold text-gray-400">
                          {CATEGORY_LABELS[l.category ?? ""] ?? l.category ?? "—"}
                        </span>
                        <span className="text-xs text-gray-300">·</span>
                        <span className="text-xs text-gray-400 font-medium">
                          {new Date(l.created_at).toLocaleDateString("ro-RO", {
                            day: "numeric", month: "long", year: "numeric",
                          })}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#1a1a2e] mb-1">{l.name}</h3>
                      {l.address && (
                        <p className="text-sm text-gray-500 font-medium mb-2">📍 {l.address}</p>
                      )}
                      {l.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-3">
                          {l.description}
                        </p>
                      )}

                      {/* Contact info */}
                      <div className="bg-gray-50 rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-1.5">
                        {l.contact_name && (
                          <span className="text-xs font-semibold text-gray-600">👤 {l.contact_name}</span>
                        )}
                        {l.contact_email && (
                          <a
                            href={`mailto:${l.contact_email}`}
                            className="text-xs font-semibold text-[#ff5a2e] hover:underline"
                          >
                            ✉️ {l.contact_email}
                          </a>
                        )}
                        {l.phone && (
                          <span className="text-xs font-semibold text-gray-600">📞 {l.phone}</span>
                        )}
                        {l.website && (
                          <a
                            href={l.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-sky-600 hover:underline"
                          >
                            🌐 {l.website}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <form action={approveWithId}>
                        <button
                          type="submit"
                          className="w-full sm:w-32 bg-green-500 hover:bg-green-600 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
                        >
                          ✓ Aprobă
                        </button>
                      </form>
                      <a
                        href={`/admin/edit/${l.id}`}
                        className="block w-full sm:w-32 bg-white border border-gray-200 hover:border-[#ff5a2e] text-gray-600 hover:text-[#ff5a2e] font-bold text-sm px-4 py-2.5 rounded-xl transition-colors text-center"
                      >
                        ✎ Editează
                      </a>
                      <DeleteButton action={rejectWithId} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
