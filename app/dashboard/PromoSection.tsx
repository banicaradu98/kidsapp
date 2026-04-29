"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function PromoSection({ listingId, listingName, listingSlug, listingCategory, siteUrl }: {
  listingId: string;
  listingName: string;
  listingSlug?: string | null;
  listingCategory?: string | null;
  siteUrl: string;
}) {
  const url = listingSlug && listingCategory
    ? `${siteUrl}/${listingCategory}/${listingSlug}`
    : `${siteUrl}/listing/${listingId}`;
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  function download() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${listingName.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-black text-[#1a1a2e] mb-1">📱 Promovează locația ta</h2>
      <p className="text-xs text-gray-400 font-medium mb-5">
        Printează QR-ul și pune-l pe ușă, meniu sau fluturaș!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* QR Code */}
        <div ref={canvasRef} className="shrink-0 p-3 border border-gray-100 rounded-2xl bg-white shadow-sm">
          <QRCodeCanvas
            value={url}
            size={140}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
            level="M"
            marginSize={1}
          />
        </div>

        {/* Actions */}
        <div className="flex-1 w-full">
          <p className="text-xs font-semibold text-gray-500 mb-3 break-all bg-gray-50 px-3 py-2 rounded-xl">
            {url}
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={download}
              className="w-full bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm py-3 rounded-xl transition-colors"
            >
              ⬇ Descarcă QR Code PNG
            </button>
            <button
              onClick={copyLink}
              className={`w-full border-2 font-black text-sm py-3 rounded-xl transition-all ${
                copied
                  ? "border-green-500 text-green-600 bg-green-50"
                  : "border-[#ff5a2e] text-[#ff5a2e] hover:bg-orange-50"
              }`}
            >
              {copied ? "✓ Link copiat!" : "🔗 Copiază link"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
