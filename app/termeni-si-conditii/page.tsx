import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata = {
  title: "Termeni și Condiții",
  description: "Termenii și condițiile de utilizare ale platformei Moosey.",
  alternates: { canonical: "/termeni-si-conditii" },
  robots: "noindex",
};

export default function TermeniConditii() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">

        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff5a2e] transition-colors mb-10">
          ← Înapoi acasă
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a2e] leading-tight mb-4">
          Termeni și Condiții
        </h1>
        <p className="text-gray-400 text-sm mb-12">Ultima actualizare: Aprilie 2026</p>

        <div className="prose prose-gray max-w-none space-y-10 text-[#374151] leading-relaxed">

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">1. Despre platformă</h2>
            <p>
              Moosey este o platformă online care listează activități, locuri de joacă, cursuri și evenimente pentru
              copii din Sibiu. Prin utilizarea platformei, ești de acord cu prezentii termeni și condiții.
              Dacă nu ești de acord, te rugăm să nu utilizezi platforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">2. Utilizarea platformei</h2>
            <p>Prin utilizarea Moosey, te angajezi să:</p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Furnizezi informații corecte și actualizate atunci când îți creezi un cont sau adaugi un listing</li>
              <li>Nu folosești platforma în scopuri ilegale sau care încalcă drepturile terților</li>
              <li>Nu publici conținut fals, înșelător, ofensator sau care promovează discriminarea</li>
              <li>Nu perturbi funcționarea platformei prin atacuri informatice sau alte mijloace tehnice</li>
              <li>Respecți drepturile de proprietate intelectuală ale Moosey și ale altor utilizatori</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">3. Conturi de utilizator</h2>
            <p>
              Pentru anumite funcționalități (recenzii, favorite, revendicarea unui listing) este necesar un cont.
              Ești responsabil pentru securitatea contului tău și pentru toate activitățile efectuate prin acesta.
              Ne rezervăm dreptul de a suspenda sau șterge conturile care încalcă acești termeni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">4. Listinguri și conținut generat de utilizatori</h2>
            <p>
              Organizatorii care adaugă sau revendică un listing sunt responsabili pentru acuratețea informațiilor
              publicate. Moosey verifică listingurile înainte de publicare, dar nu garantează că toate informațiile
              sunt complete sau actualizate în permanență.
            </p>
            <p className="mt-3">
              Prin publicarea de conținut pe platformă (recenzii, descrieri, imagini), acorzi Moosey o licență
              neexclusivă, gratuită și revocabilă la cerere, de a afișa acel conținut în cadrul platformei.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">5. Recenzii</h2>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Recenziile trebuie să reflecte experiența reală a utilizatorului</li>
              <li>Nu sunt permise recenziile false, plătite sau coordonate</li>
              <li>Ne rezervăm dreptul de a elimina recenziile care încalcă aceste reguli</li>
              <li>Organizatorii pot răspunde la recenzii în mod public</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">6. Marketplace</h2>
            <p>
              Secțiunea Marketplace permite utilizatorilor să publice anunțuri pentru articole second-hand
              destinate copiilor. Moosey acționează exclusiv ca platformă de intermediere — nu este parte
              în tranzacțiile dintre utilizatori și nu răspunde pentru calitatea produselor, livrare sau plată.
              Tranzacțiile se realizează direct între cumpărător și vânzător, pe răspunderea exclusivă a acestora.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">7. Proprietate intelectuală</h2>
            <p>
              Toate elementele platformei Moosey — inclusiv logo-ul, designul, textele originale și codul sursă —
              sunt proprietatea Moosey și sunt protejate de legislația privind drepturile de autor.
              Este interzisă copierea, reproducerea sau distribuirea fără acordul scris al Moosey.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">8. Limitarea răspunderii</h2>
            <p>
              Moosey nu garantează exactitatea, completitudinea sau disponibilitatea continuă a informațiilor
              de pe platformă. Nu suntem răspunzători pentru daune directe sau indirecte rezultate din utilizarea
              sau imposibilitatea utilizării platformei, inclusiv pentru informațiile furnizate de organizatori
              sau alți utilizatori.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">9. Modificări ale termenilor</h2>
            <p>
              Ne rezervăm dreptul de a modifica acești termeni oricând. Modificările semnificative vor fi
              comunicate prin email sau notificare pe platformă. Continuarea utilizării platformei după publicarea
              modificărilor constituie acceptarea noilor termeni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">10. Legislație aplicabilă</h2>
            <p>
              Acești termeni sunt guvernați de legislația română. Orice litigiu va fi soluționat de instanțele
              competente din România.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black text-[#ff5a2e] mb-3">11. Contact</h2>
            <p>
              Pentru orice întrebare legată de acești termeni, ne contactezi la:<br />
              <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
