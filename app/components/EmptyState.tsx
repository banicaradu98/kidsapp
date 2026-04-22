export default function EmptyState({
  title = "Moosey nu a găsit nimic aici...",
  subtitle = "Încearcă alte filtre sau revino mai târziu!",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center py-16 gap-4 text-center px-4">
      <img
        src="/images/moosey_transparent.png"
        alt="Moosey"
        className="h-32 w-auto object-contain opacity-80 pointer-events-none"
        style={{ animation: "gentleBounce 2s ease-in-out infinite" }}
      />
      <p className="text-xl font-semibold text-gray-700">{title}</p>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
