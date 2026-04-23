import type { Metadata } from 'next';
import TerymeniContent from './TerymeniContent';

export const metadata: Metadata = {
  title: "Termeni și Condiții",
  description: "Termenii și condițiile de utilizare ale platformei Moosey.",
  alternates: { canonical: "/termeni-si-conditii" },
  robots: "noindex",
};

export default function Page() {
  return <TerymeniContent />;
}
