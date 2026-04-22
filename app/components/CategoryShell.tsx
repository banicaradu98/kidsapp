import Navbar from "./Navbar";

export default function CategoryShell({
  title,
  subtitle,
  emoji,
  count,
  children,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      {/* Page title */}
      <div className="bg-white border-b border-gray-100 px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">{emoji}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e]">{title}</h1>
          </div>
          <p className="text-base text-gray-500 font-medium mt-1">{subtitle}</p>
          <p className="text-base font-bold text-[#ff5a2e] mt-2">
            {count} {count === 1 ? "loc găsit" : "locuri găsite"} în Sibiu
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </div>

    </div>
  );
}
