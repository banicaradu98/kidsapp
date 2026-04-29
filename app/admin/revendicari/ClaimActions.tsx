"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveClaim, rejectClaim } from "../actions";

interface Props {
  claimId: string;
  listingId: string;
  userId: string;
}

export default function ClaimActions({ claimId, listingId, userId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    await approveClaim(claimId, listingId, userId);
    router.refresh();
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    await rejectClaim(claimId, listingId);
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={handleApprove}
        disabled={!!loading}
        className="text-sm font-bold text-green-600 hover:underline disabled:opacity-40"
      >
        {loading === "approve" ? "Se procesează..." : "Aprobă"}
      </button>
      <button
        onClick={handleReject}
        disabled={!!loading}
        className="text-sm font-bold text-red-500 hover:underline disabled:opacity-40"
      >
        {loading === "reject" ? "Se procesează..." : "Respinge"}
      </button>
    </div>
  );
}
