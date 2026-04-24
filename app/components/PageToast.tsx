"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TOASTS: Record<string, string> = {
  "deleted": "Contul tău a fost șters. La revedere! 👋",
};

export default function PageToast() {
  const params = useSearchParams();
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const deleted = params.get("deleted");
    if (deleted === "true") setMsg(TOASTS["deleted"]);
  }, [params]);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 5000);
    return () => clearTimeout(t);
  }, [msg]);

  if (!msg) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] bg-[#1a1a2e] text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold whitespace-nowrap">
      {msg}
    </div>
  );
}
