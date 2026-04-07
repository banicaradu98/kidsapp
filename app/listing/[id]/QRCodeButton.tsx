"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeButton({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  function download() {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${name.slice(0, 30).replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-[#ff5a2e] hover:text-[#ff5a2e] text-gray-500 font-bold text-sm py-3 rounded-xl transition-all"
      >
        📱 QR Code
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-black text-[#1a1a2e] mb-1">QR Code</h3>
            <p className="text-xs text-gray-400 font-medium mb-4 leading-snug">{name}</p>

            <div ref={canvasRef} className="flex justify-center mb-5">
              <QRCodeCanvas
                value={url}
                size={200}
                bgColor="#ffffff"
                fgColor="#1a1a2e"
                level="M"
                marginSize={2}
              />
            </div>

            <p className="text-xs text-gray-400 font-medium mb-4 break-all">{url}</p>

            <div className="flex gap-2">
              <button
                onClick={download}
                className="flex-1 bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black text-sm py-3 rounded-xl transition-colors"
              >
                ⬇ Descarcă PNG
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-4 border border-gray-200 text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
