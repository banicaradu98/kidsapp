"use client";

import { useState } from "react";

export default function DescriptionCollapse({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <p
        className={`text-gray-600 text-base font-medium leading-relaxed transition-all ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-bold text-[#ff5a2e] hover:underline"
      >
        {expanded ? "Arată mai puțin ↑" : "Citește mai mult ↓"}
      </button>
    </div>
  );
}
