import { Nunito } from "next/font/google";
import "../globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata = { title: "Admin — KidsApp Sibiu" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${nunito.variable} font-[family-name:var(--font-nunito)]`}>
      {children}
    </div>
  );
}
