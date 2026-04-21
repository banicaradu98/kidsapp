import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Gradient classes — folosite dinamic prin CATEGORY_META (meta.gradientFrom / meta.gradientTo)
    // Tailwind JIT nu poate detecta clasele compuse la runtime din lookup-uri de obiect
    "from-orange-50",  "to-orange-100",
    "from-green-50",   "to-green-100",
    "from-purple-50",  "to-purple-100",
    "from-sky-50",     "to-sky-100",
    "from-rose-50",    "to-rose-100",
    "from-pink-50",    "to-pink-100",
    "from-gray-50",    "to-gray-100",
    // Variante mai intense — folosite în pagina de detaliu /listing/[id]
    "from-orange-100", "to-orange-200",
    "from-green-100",  "to-green-200",
    "from-purple-100", "to-purple-200",
    "from-sky-100",    "to-sky-200",
    "from-rose-100",   "to-rose-200",
    "from-pink-100",   "to-pink-200",
    "from-gray-100",   "to-gray-200",
    // Tag colors — folosite dinamic prin meta.tagColor (două clase per string)
    "bg-orange-100", "text-orange-700",
    "bg-green-100",  "text-green-700",
    "bg-purple-100", "text-purple-700",
    "bg-sky-100",    "text-sky-700",
    "bg-rose-100",   "text-rose-700",
    "bg-pink-100",   "text-pink-700",
    "bg-gray-100",   "text-gray-700",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50:  "#fff4f0",
          100: "#ffe4d9",
          200: "#ffbfab",
          300: "#ff9778",
          400: "#ff6b45",
          500: "#ff5a2e",
          600: "#f03d12",
          700: "#c72e0e",
          800: "#a02612",
          900: "#832315",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        rounded: ["Nunito", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 2px 16px 0 rgba(0,0,0,0.07)",
        "card-hover": "0 8px 32px 0 rgba(0,0,0,0.13)",
      },
    },
  },
  plugins: [],
};
export default config;
