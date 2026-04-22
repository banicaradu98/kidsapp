import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/images/moosey_transparent.png"
        alt="Moosey"
        className="h-48 w-auto object-contain mascot-shake pointer-events-none mb-2"
      />
      <h1 className="text-3xl font-black text-[#1a1a2e] mb-2">
        Ups! Ne-am rătăcit în pădure 🌲
      </h1>
      <p className="text-gray-500 font-medium mb-8 max-w-sm">
        Moosey nu găsește pagina asta...
      </p>
      <Link
        href="/"
        className="bg-[#ff5a2e] hover:bg-[#f03d12] text-white font-black px-8 py-4 rounded-2xl transition-colors text-base"
      >
        Înapoi acasă
      </Link>
    </div>
  );
}
