export default function EmptyState({
  title = "Moosey nu a găsit nimic aici...",
  subtitle = "Încearcă alte filtre sau revino mai târziu!",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center py-16 gap-4 text-center px-4">
      <div className="relative">
        <img
          src="/images/moosey_transparent.png"
          alt="Moosey"
          className="h-40 w-auto object-contain opacity-90 pointer-events-none mascot-search"
        />
        <span
          className="absolute bottom-0 right-0 text-2xl"
          style={{ animation: "mascotWalk 1.2s ease-in-out infinite" }}
        >
          🔍
        </span>
      </div>
      <p
        className="text-xl font-semibold text-gray-700"
        style={{ animationDelay: "0.5s", animation: "fadeSlideUp 0.5s ease-out 0.5s both" }}
      >
        {title}
      </p>
      <p className="text-gray-400 text-sm">{subtitle}</p>
    </div>
  );
}
