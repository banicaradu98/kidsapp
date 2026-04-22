import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Politică de Confidențialitate",
  description: "Politica de confidențialitate Moosey — cum colectăm, folosim și protejăm datele tale personale.",
  alternates: { canonical: "/politica-de-confidentialitate" },
  robots: "noindex",
};

export default function PoliticaConfidentialitate() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff5a2e] transition-colors mb-10">
          ← Înapoi acasă
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a2e] leading-tight mb-4">
          Politică de Confidențialitate
        </h1>
        <p className="text-gray-400 text-sm mb-12">Ultima actualizare: Aprilie 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[#374151] leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">1. Cine suntem</h2>
            <p>
              Moosey este o platformă online care listează activități, locuri de joacă, cursuri și evenimente pentru copii din Sibiu.
              Operatorul datelor cu caracter personal este <strong>Moosey</strong>, cu sediul în Sibiu, România.
              Ne poți contacta la adresa de email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">2. Ce date colectăm</h2>
            <p>Colectăm următoarele categorii de date personale:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Date de identificare:</strong> nume, prenume, adresă de email</li>
              <li><strong>Date de autentificare:</strong> email și parolă (stocate criptat) sau date din contul Google dacă folosești autentificarea Google</li>
              <li><strong>Conținut generat:</strong> poze uploadate, recenzii, anunțuri marketplace, mesaje trimise prin platformă</li>
              <li><strong>Date tehnice:</strong> adresă IP, tipul de browser, paginile vizitate — colectate automat prin loguri de sistem</li>
              <li><strong>Date de contact ale organizatorilor:</strong> număr de telefon, adresă (pentru listinguri revendicate)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">3. De ce colectăm datele</h2>
            <p>Prelucrăm datele tale în următoarele scopuri:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Furnizarea serviciului:</strong> crearea și gestionarea contului tău, autentificare</li>
              <li><strong>Funcționalitate platformă:</strong> salvarea favoritelor, lăsarea de recenzii, publicarea anunțurilor</li>
              <li><strong>Comunicare:</strong> răspunsuri la solicitările tale, notificări legate de cont</li>
              <li><strong>Securitate:</strong> detectarea și prevenirea fraudelor sau accesului neautorizat</li>
              <li><strong>Îmbunătățirea serviciului:</strong> analiză statistică anonimizată a utilizării platformei</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">4. Temeiul legal al prelucrării</h2>
            <p>Prelucrăm datele tale pe baza:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Executarea unui contract</strong> — pentru furnizarea serviciilor platformei (Art. 6(1)(b) GDPR)</li>
              <li><strong>Consimțământul tău</strong> — pentru comunicări de marketing, dacă îl acorzi explicit</li>
              <li><strong>Interesul legitim</strong> — pentru securitatea platformei și prevenirea fraudelor (Art. 6(1)(f) GDPR)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">5. Cât timp păstrăm datele</h2>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Datele contului:</strong> pe durata existenței contului + 30 de zile după ștergere</li>
              <li><strong>Recenzii și conținut public:</strong> pe durata existenței platformei, dacă nu soliciți ștergerea</li>
              <li><strong>Loguri tehnice:</strong> maxim 90 de zile</li>
              <li><strong>Mesaje:</strong> pe durata existenței contului</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">6. Cui transmitem datele</h2>
            <p>Nu vindem datele tale. Le transmitem doar către:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Supabase</strong> (furnizor de bază de date și autentificare) — server localizat în UE sau SUA</li>
              <li><strong>Vercel</strong> (hosting aplicație) — server localizat în SUA, cu garanții GDPR prin Clauzele Contractuale Standard</li>
              <li><strong>Google</strong> — exclusiv dacă folosești autentificarea Google OAuth</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">7. Drepturile tale</h2>
            <p>Conform GDPR, ai următoarele drepturi:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Dreptul de acces</strong> — poți solicita o copie a datelor pe care le deținem despre tine</li>
              <li><strong>Dreptul la rectificare</strong> — poți corecta datele inexacte direct din contul tău sau contactându-ne</li>
              <li><strong>Dreptul la ștergere</strong> — poți solicita ștergerea contului și a datelor asociate</li>
              <li><strong>Dreptul la portabilitate</strong> — poți solicita datele într-un format structurat</li>
              <li><strong>Dreptul la opoziție</strong> — poți obiecta față de prelucrarea bazată pe interes legitim</li>
              <li><strong>Dreptul de a depune plângere</strong> — la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">www.dataprotection.ro</a></li>
            </ul>
            <p className="mt-4">Pentru a-ți exercita drepturile, ne contactezi la: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">8. Cookie-uri</h2>
            <p>
              Folosim cookie-uri esențiale pentru autentificare și funcționarea platformei. Nu folosim cookie-uri de tracking terțe sau publicitate.
              Poți gestiona cookie-urile din setările browser-ului tău.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">9. Modificări ale politicii</h2>
            <p>
              Ne rezervăm dreptul de a actualiza această politică. Modificările semnificative vor fi comunicate prin email sau prin notificare pe platformă.
              Data ultimei actualizări este indicată la începutul acestei pagini.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">10. Contact</h2>
            <p>
              Pentru orice întrebare legată de protecția datelor personale, ne contactezi la:<br />
              <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
