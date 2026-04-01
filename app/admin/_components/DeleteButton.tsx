"use client";

import { useTransition } from "react";

export default function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Ești sigur că vrei să ștergi acest listing? Acțiunea este ireversibilă.")) return;
    startTransition(() => { action(); });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
    >
      {pending ? "Se șterge..." : "Șterge"}
    </button>
  );
}
