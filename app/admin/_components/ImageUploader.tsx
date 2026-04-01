"use client";

import { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

function reorder(list: string[], from: number, to: number): string[] {
  const result = [...list];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

interface Props {
  defaultImages?: string[];
  endpoint?: string;
  maxFiles?: number;
}

export default function ImageUploader({ defaultImages = [], endpoint = "/api/upload", maxFiles = 20 }: Props) {
  const [images, setImages] = useState<string[]>(defaultImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    setImages((prev) => reorder(prev, result.source.index, result.destination!.index));
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    setError(null);
    const newUrls: string[] = [];
    const remaining = maxFiles - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" depășește 5MB`);
        continue;
      }
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(endpoint, { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) newUrls.push(data.url as string);
      else setError((data.error as string) ?? "Eroare la upload");
    }
    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    setImages((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div>
      <input type="hidden" name="images_json" value={JSON.stringify(images)} />

      {images.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-3 mb-4"
              >
                {images.map((url, index) => (
                  <Draggable key={url} draggableId={url} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 select-none transition-all ${
                          index === 0 ? "border-[#ff5a2e]" : "border-gray-200"
                        } ${snapshot.isDragging ? "shadow-2xl scale-105 z-50" : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover pointer-events-none" />
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-[#ff5a2e] text-white text-[9px] font-black text-center py-0.5 tracking-wider">
                            COVER
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(url)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-black text-white rounded-full text-sm font-black flex items-center justify-center leading-none transition-colors"
                          aria-label="Șterge"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {images.length > 0 && (
        <p className="text-xs text-gray-400 font-medium mb-3">
          Trage pozele pentru a le reordona · Prima poză = cover pe carduri și pagina listingului
        </p>
      )}

      {images.length < maxFiles && (
        <label
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
            uploading
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
              : "border-gray-300 hover:border-[#ff5a2e] hover:bg-orange-50/50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <span className="text-3xl">{uploading ? "⏳" : "📷"}</span>
          <p className="text-sm font-bold text-gray-600">
            {uploading ? "Se încarcă..." : "Adaugă fotografii"}
          </p>
          <p className="text-xs text-gray-400 text-center">
            JPG, PNG, WebP · max 5MB / fotografie
            {maxFiles < 20 && ` · max ${maxFiles} poze`}
          </p>
        </label>
      )}
      {images.length >= maxFiles && (
        <p className="text-xs font-bold text-gray-400 text-center py-3 border-2 border-dashed border-gray-100 rounded-xl">
          Ai adăugat numărul maxim de fotografii ({maxFiles})
        </p>
      )}

      {error && <p className="mt-2 text-xs font-bold text-red-500">{error}</p>}
    </div>
  );
}
