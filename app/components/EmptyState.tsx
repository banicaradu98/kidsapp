export default function EmptyState({ title = "Niciun rezultat găsit", subtitle = "Încearcă să modifici filtrele sau revino mai târziu." }: { title?: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <span className="text-6xl mb-4">🔍</span>
      <p className="text-lg font-black text-gray-700 mb-2">{title}</p>
      <p className="text-base text-gray-400 font-medium max-w-xs">{subtitle}</p>
    </div>
  );
}
