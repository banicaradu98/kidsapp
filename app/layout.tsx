import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import MascotFloat from "./components/MascotFloat";
import MascotCelebration from "./components/MascotCelebration";
import FooterWrapper from "./components/FooterWrapper";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

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
    default: "Moosey — Activități pentru copii în Sibiu",
    template: "%s | Moosey Sibiu",
  },
  description:
    "Descoperă locuri de joacă, cursuri, spectacole și evenimente pentru copii din Sibiu. Moosey — platforma familiilor din Sibiu.",
  keywords: [
    "activitati copii Sibiu",
    "locuri de joaca Sibiu",
    "cursuri copii Sibiu",
    "spectacole copii Sibiu",
    "after school Sibiu",
    "gradinita Sibiu",
    "robotica Sibiu",
    "dans copii Sibiu",
    "sport copii Sibiu",
    "ateliere creative Sibiu",
    "ce facem cu copilul Sibiu",
    "evenimente copii Sibiu",
  ],
  authors: [{ name: "Moosey", url: siteUrl }],
  creator: "Moosey",
  publisher: "Moosey",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: siteUrl,
    siteName: "Moosey",
    title: "Moosey — Activități pentru copii în Sibiu",
    description:
      "Descoperă locuri de joacă, cursuri, spectacole și evenimente pentru copii din Sibiu.",
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
    title: "Moosey — Activități pentru copii în Sibiu",
    description:
      "Descoperă locuri de joacă, cursuri, spectacole și evenimente pentru copii din Sibiu.",
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6D3GH3PNSV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6D3GH3PNSV');
          `}
        </Script>
      </head>
      <body className={`${playfair.variable} ${dmSans.variable} font-[family-name:var(--font-dm-sans)] antialiased`}>
        {children}
        <FooterWrapper />
        <MascotFloat />
        <MascotCelebration />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
