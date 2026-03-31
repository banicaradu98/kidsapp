import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "KidsApp Sibiu — Activități pentru copii",
  description: "Descoperă cele mai bune activități, locuri de joacă, cursuri și evenimente pentru copii în Sibiu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${nunito.variable} font-[family-name:var(--font-nunito)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
