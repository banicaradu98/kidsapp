import type { Metadata } from 'next';
import GdprContent from './GdprContent';

export const metadata: Metadata = {
  title: "Informare GDPR",
  description: "Informare GDPR Moosey — temeiul legal al prelucrării datelor, transferuri internaționale, cookie-uri și drepturile dvs.",
  alternates: { canonical: "/gdpr" },
  robots: "noindex",
};

export default function Page() {
  return <GdprContent />;
}
