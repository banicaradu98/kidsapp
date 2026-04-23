import type { Metadata } from 'next';
import PrivacyContent from './PrivacyContent';

export const metadata: Metadata = {
  title: "Politică de Confidențialitate",
  description: "Politica de confidențialitate Moosey — cum colectăm, folosim și protejăm datele tale personale.",
  alternates: { canonical: "/politica-de-confidentialitate" },
  robots: "noindex",
};

export default function Page() {
  return <PrivacyContent />;
}
