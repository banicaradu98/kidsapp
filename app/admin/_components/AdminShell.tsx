import { logoutAction } from "../actions";
import AdminNav from "./AdminNav";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function AdminShell({ children }: { children: React.ReactNode }) {
  const supabase = createClient(await cookies());
  const { count } = await supabase
    .from("claims")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  const claimsBadge = count ?? 0;
  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "Nunito, system-ui, sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-200 fixed top-0 left-0 h-full flex flex-col z-20">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧡</span>
            <div>
              <p className="font-black text-[#ff5a2e] leading-none text-lg">KidsApp</p>
              <p className="text-xs font-semibold text-gray-400 leading-none mt-0.5">Admin Panel</p>
            </div>
          </a>
        </div>

        {/* Nav */}
        <div className="flex-1 py-4 overflow-y-auto">
          <p className="px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Meniu</p>
          <AdminNav claimsBadge={claimsBadge} />
        </div>

        {/* Bottom: site link + logout */}
        <div className="px-3 py-4 border-t border-gray-100 flex flex-col gap-1">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Deschide site-ul
          </a>
          <form action={logoutAction}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Deconectare
            </button>
          </form>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="ml-60 flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </div>

    </div>
  );
}
