import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace Second-hand pentru Copii în Sibiu",
  description: "Cumpără, vinde sau donează articole pentru copii în Sibiu. Cărucioare, hăinuțe, jucării și accesorii second-hand.",
  alternates: { canonical: "https://www.moosey.ro/marketplace" },
  openGraph: {
    title: "Marketplace Second-hand pentru Copii | Moosey Sibiu",
    description: "Cumpără, vinde sau donează articole pentru copii în Sibiu.",
    url: "https://www.moosey.ro/marketplace",
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
