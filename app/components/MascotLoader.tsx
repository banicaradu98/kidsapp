export default function MascotLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <img
        src="/images/moosey_transparent.png"
        alt="Se încarcă..."
        className="h-16 w-auto object-contain pointer-events-none"
        style={{ animation: "gentleBounce 0.8s ease-in-out infinite" }}
      />
      <p className="text-gray-400 text-sm">Se încarcă...</p>
    </div>
  );
}
