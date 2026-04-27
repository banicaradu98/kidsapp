import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează echipa Moosey — pentru întrebări, parteneriate sau sugestii despre activitățile pentru copii din Sibiu.",
  alternates: { canonical: "https://www.moosey.ro/contact" },
  openGraph: {
    title: "Contact — Moosey",
    description: "Contactează echipa Moosey pentru întrebări, parteneriate sau sugestii.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
