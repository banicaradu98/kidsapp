import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import MascotFloat from "./components/MascotFloat";
import MascotCelebration from "./components/MascotCelebration";
import FooterWrapper from "./components/FooterWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.moosey.ro";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Moosey — Activități și locuri pentru copii",
    template: "%s — Moosey",
  },
  description:
    "Descoperă cele mai frumoase locuri de joacă, cursuri, ateliere, sport și spectacole pentru copii din Sibiu. Gratuit pentru părinți.",
  keywords: [
    "activitati copii sibiu",
    "locuri joaca sibiu",
    "cursuri copii sibiu",
    "gradinite sibiu",
    "spectacole copii sibiu",
    "ateliere copii sibiu",
    "sport copii sibiu",
    "ce facem cu copilul sibiu",
  ],
  authors: [{ name: "Moosey", url: siteUrl }],
  creator: "Moosey",
  publisher: "Moosey",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: siteUrl,
    siteName: "Moosey",
    title: "Moosey — Activități și locuri pentru copii",
    description:
      "Descoperă cele mai frumoase locuri de joacă, cursuri, ateliere, sport și spectacole pentru copii din Sibiu.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Moosey — Activități pentru copii",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Moosey — Activități și locuri pentru copii",
    description:
      "Descoperă sute de activități, locuri de joacă și evenimente pentru copii din Sibiu.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${playfair.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] antialiased`}>
        {children}
        <FooterWrapper />
        <MascotFloat />
        <MascotCelebration />
      </body>
    </html>
  );
}
