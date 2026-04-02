import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import AdminShell from "../_components/AdminShell";
import { approveClaim, rejectClaim } from "../actions";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
}

export default async function RevendicariPage() {
  const supabase = createClient(await cookies());

  const { data: claims } = await supabase
    .from("claims")
    .select(`
      id, email, message, status, created_at,
      listing_id, listings(id, name),
      user_id
    `)
    .order("created_at", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (claims ?? []) as any[];
  const pending = rows.filter((r) => r.status === "pending");
  const others  = rows.filter((r) => r.status !== "pending");

  return (
    <AdminShell>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-[#1a1a2e]">Revendicări</h1>
            <p className="text-gray-500 font-medium mt-0.5">
              {pending.length} în așteptare · {others.length} procesate
            </p>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <p className="text-3xl mb-3">📭</p>
            <p className="font-bold text-gray-500">Nicio cerere de revendicare încă.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 font-bold text-gray-500">Listing</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500">Email contact</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500">Mesaj</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500">Data</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-500">Status</th>
                    <th className="text-right px-5 py-3 font-bold text-gray-500">Acțiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((claim) => {
                    const approveAction = approveClaim.bind(null, claim.id, claim.listing_id, claim.user_id);
                    const rejectAction  = rejectClaim.bind(null, claim.id);
                    return (
                      <tr key={claim.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-gray-800 max-w-[160px] truncate">
                          <a href={`/listing/${claim.listing_id}`} target="_blank" className="hover:text-[#ff5a2e] transition-colors">
                            {claim.listings?.name ?? "—"}
                          </a>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">{claim.email}</td>
                        <td className="px-4 py-3.5 text-gray-500 max-w-[200px] truncate">
                          {claim.message ?? <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{formatDate(claim.created_at)}</td>
                        <td className="px-4 py-3.5 text-center">
                          {claim.status === "pending"  && <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">⏳ Pending</span>}
                          {claim.status === "approved" && <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">✓ Aprobat</span>}
                          {claim.status === "rejected" && <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">✗ Respins</span>}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          {claim.status === "pending" && (
                            <>
                              <form action={approveAction} className="inline">
                                <button className="text-sm font-bold text-green-600 hover:underline mr-3">Aprobă</button>
                              </form>
                              <form action={rejectAction} className="inline">
                                <button className="text-sm font-bold text-red-500 hover:underline">Respinge</button>
                              </form>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
