"use client";

import { useState } from "react";
import RichTextDisplay from "@/app/components/RichTextDisplay";

export default function DescriptionCollapse({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`text-gray-600 text-base font-medium leading-relaxed transition-all overflow-hidden ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        <RichTextDisplay html={text} />
      </div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="mt-2 text-sm font-bold text-[#ff5a2e] hover:underline"
      >
        {expanded ? "Arată mai puțin ↑" : "Citește mai mult ↓"}
      </button>
    </div>
  );
}
