"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveListingButton({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleApprove() {
    setState("loading");
    try {
      const res = await fetch("/api/approve-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.ok) {
        setState("done");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("[ApproveListingButton]", data.error);
        setState("error");
      }
    } catch (err) {
      console.error("[ApproveListingButton]", err);
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <span className="w-full sm:w-32 flex items-center justify-center gap-1 bg-green-100 text-green-700 font-black text-sm px-4 py-2.5 rounded-xl">
        ✓ Aprobat
      </span>
    );
  }

  if (state === "error") {
    return (
      <button
        onClick={handleApprove}
        className="w-full sm:w-32 bg-red-500 hover:bg-red-600 text-white font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
      >
        ⚠ Retry
      </button>
    );
  }

  return (
    <button
      onClick={handleApprove}
      disabled={state === "loading"}
      className="w-full sm:w-32 bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
    >
      {state === "loading" ? "Se aprobă..." : "✓ Aprobă"}
    </button>
  );
}
