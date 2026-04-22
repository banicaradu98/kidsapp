import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Informare GDPR",
  description: "Informare GDPR — temeiul legal al prelucrării datelor, transferuri internaționale, cookie-uri și drepturile tale conform Regulamentului European.",
  alternates: { canonical: "/gdpr" },
  robots: "noindex",
};

export default function GdprPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff5a2e] transition-colors mb-10">
          ← Înapoi acasă
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a2e] leading-tight mb-4">
          Informare GDPR
        </h1>
        <p className="text-gray-400 text-sm mb-12">Ultima actualizare: Aprilie 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[#374151] leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">1. Operator de date</h2>
            <p>
              Operatorul datelor cu caracter personal este <strong>Moosey</strong>, cu sediul în Sibiu, România.
              Persoana de contact pentru protecția datelor (DPO): <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">2. Temeiul legal al prelucrării</h2>
            <p>Prelucrăm datele tale cu caracter personal în baza următoarelor temeiuri legale prevăzute de GDPR:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Art. 6(1)(b) — Executarea unui contract:</strong> prelucrarea necesară pentru furnizarea
                serviciilor platformei (autentificare, gestionarea contului, funcționalități de bază)
              </li>
              <li>
                <strong>Art. 6(1)(a) — Consimțământ:</strong> pentru comunicări de marketing și newsletter,
                dacă îl acorzi explicit și separat
              </li>
              <li>
                <strong>Art. 6(1)(f) — Interes legitim:</strong> pentru securitatea platformei, prevenirea
                fraudelor și analiza statistică anonimizată a utilizării
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">3. Transferuri internaționale de date</h2>
            <p>
              Unii furnizori de servicii pe care îi utilizăm pot prelucra date în afara Spațiului Economic European (SEE).
              Ne asigurăm că aceste transferuri respectă cerințele GDPR prin mecanisme adecvate:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                <strong>Supabase</strong> — furnizor de bază de date și autentificare; serverele pot fi localizate
                în UE sau SUA. Transferurile către SUA sunt acoperite de Clauzele Contractuale Standard (SCC)
                adoptate de Comisia Europeană.
              </li>
              <li>
                <strong>Vercel</strong> — platformă de hosting; servere în SUA, cu garanții GDPR prin Clauzele
                Contractuale Standard și aderarea la Data Privacy Framework EU-SUA.
              </li>
              <li>
                <strong>Google</strong> — exclusiv pentru autentificarea prin Google OAuth; date transferate
                conform Privacy Shield successor și SCC.
              </li>
            </ul>
            <p className="mt-3">
              Poți solicita o copie a mecanismelor de transfer utilizate contactându-ne la
              <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline ml-1">hello@moosey.ro</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">4. Cookie-uri folosite</h2>
            <p>Platforma Moosey folosește următoarele categorii de cookie-uri:</p>
            <div className="mt-3 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-[#1a1a2e] mb-1">Cookie-uri esențiale</p>
                <p className="text-sm text-gray-600">
                  Necesare pentru funcționarea platformei. Nu pot fi dezactivate.
                  Includ cookie-ul de sesiune Supabase (<code className="text-xs bg-gray-200 px-1 rounded">sb-access-token</code>,{" "}
                  <code className="text-xs bg-gray-200 px-1 rounded">sb-refresh-token</code>) pentru autentificare
                  și cookie-ul de sesiune admin (<code className="text-xs bg-gray-200 px-1 rounded">admin_session</code>).
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-bold text-[#1a1a2e] mb-1">Cookie-uri de preferințe</p>
                <p className="text-sm text-gray-600">
                  Stocate în <code className="text-xs bg-gray-200 px-1 rounded">localStorage</code> (nu cookie-uri propriu-zise),
                  folosite pentru preferințe locale (ex: prima vizită pe site).
                </p>
              </div>
            </div>
            <p className="mt-4">
              Nu folosim cookie-uri de tracking terțe, cookie-uri publicitare sau cookie-uri de analiză comportamentală.
              Poți gestiona sau șterge cookie-urile din setările browser-ului tău.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">5. Drepturile tale conform GDPR</h2>
            <p>Conform Regulamentului (UE) 2016/679, ai următoarele drepturi:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li><strong>Dreptul de acces (Art. 15):</strong> poți solicita o copie a datelor pe care le deținem despre tine</li>
              <li><strong>Dreptul la rectificare (Art. 16):</strong> poți corecta datele inexacte direct din contul tău sau contactându-ne</li>
              <li><strong>Dreptul la ștergere (Art. 17):</strong> „dreptul de a fi uitat" — poți solicita ștergerea datelor tale</li>
              <li><strong>Dreptul la restricționarea prelucrării (Art. 18):</strong> poți solicita limitarea prelucrării în anumite circumstanțe</li>
              <li><strong>Dreptul la portabilitatea datelor (Art. 20):</strong> poți solicita datele tale într-un format structurat, utilizat frecvent și citibil automat</li>
              <li><strong>Dreptul la opoziție (Art. 21):</strong> poți obiecta față de prelucrarea bazată pe interes legitim</li>
              <li><strong>Dreptul de a retrage consimțământul:</strong> dacă prelucrarea se bazează pe consimțământ, îl poți retrage oricând, fără a afecta legalitatea prelucrării anterioare</li>
            </ul>
            <p className="mt-4">
              Pentru exercitarea oricărui drept, trimite o cerere la:{" "}
              <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a>.
              Vom răspunde în termen de 30 de zile.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">6. Dreptul de a depune plângere la ANSPDCP</h2>
            <p>
              Dacă consideri că prelucrarea datelor tale încalcă GDPR, ai dreptul să depui o plângere la
              autoritatea de supraveghere competentă din România:
            </p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-3">
              <p className="font-bold text-[#1a1a2e]">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
              <p className="text-sm text-gray-600 mt-1">B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București</p>
              <p className="text-sm mt-1">
                <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">
                  www.dataprotection.ro
                </a>
              </p>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Te încurajăm să ne contactezi mai întâi direct — de obicei putem rezolva orice problemă rapid
              și fără a fi necesară implicarea autorității.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">7. Date de contact DPO</h2>
            <p>
              Responsabilul cu protecția datelor (DPO) poate fi contactat la:<br />
              <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
