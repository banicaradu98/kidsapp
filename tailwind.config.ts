import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
