'use client';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

function VersionEN() {
  return (
    <div className="text-gray-700 leading-relaxed">
      <p className="text-sm text-gray-400 mb-8">Last updated: April 23, 2026</p>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Introduction</h2>
        <p>This Privacy Policy describes how Moosey (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects, uses, and protects your personal data when you use our website available at www.moosey.ro (the &ldquo;Service&rdquo;). We are committed to protecting your privacy in accordance with the General Data Protection Regulation (EU) 2016/679 (&ldquo;GDPR&rdquo;) and Romanian Law no. 190/2018 on the implementation of GDPR.</p>
        <p className="mt-2">By using our Service, you agree to the collection and use of information as described in this Policy.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. Data Controller</h2>
        <p>The data controller responsible for your personal data is:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Moosey Platform</li>
          <li>Website: www.moosey.ro</li>
          <li>Contact email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. Data We Collect</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Account Data</h3>
        <p>When you create an account, we collect:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Full name</li>
          <li>Email address</li>
          <li>Profile photo (optional, via Google OAuth)</li>
          <li>Authentication data (password hash or OAuth token)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 User-Generated Content</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Activity listings you submit or claim</li>
          <li>Reviews and ratings you leave</li>
          <li>Photos you upload to listings or marketplace</li>
          <li>Marketplace listings (title, description, price, photos)</li>
          <li>Messages sent through the internal messaging system</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 Usage Data</h3>
        <p>Automatically collected data includes:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>IP address and browser type</li>
          <li>Pages visited and time spent</li>
          <li>Device type and operating system</li>
          <li>Referring URLs</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Cookies &amp; Tracking</h3>
        <p>We use the following types of cookies:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Essential cookies:</span> required for authentication and security</li>
          <li><span className="font-semibold">Functional cookies:</span> remember your preferences and login</li>
          <li><span className="font-semibold">Analytics cookies:</span> Google Analytics — used to understand how visitors use our site</li>
        </ul>
        <p className="mt-2">Analytics cookies are only used with your consent. You can withdraw consent at any time through your browser settings or by contacting us.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Legal Basis for Processing</h2>
        <p>We process your personal data based on the following legal grounds under GDPR Article 6:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Contract performance (Art. 6(1)(b)):</span> to provide you access to the Service</li>
          <li><span className="font-semibold">Legitimate interests (Art. 6(1)(f)):</span> to improve the platform and prevent fraud</li>
          <li><span className="font-semibold">Consent (Art. 6(1)(a)):</span> for analytics cookies and marketing emails</li>
          <li><span className="font-semibold">Legal obligation (Art. 6(1)(c)):</span> when required by Romanian or EU law</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>To create and manage your account</li>
          <li>To allow you to post listings, reviews, and marketplace ads</li>
          <li>To facilitate messaging between users</li>
          <li>To send transactional emails (account confirmation, password reset)</li>
          <li>To send newsletters and updates (only with your consent)</li>
          <li>To improve and analyze how the Service is used</li>
          <li>To prevent fraud and ensure platform security</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Data Retention</h2>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Account data:</span> retained for the duration of your account + 24 months after closure</li>
          <li><span className="font-semibold">Messages:</span> retained for 24 months</li>
          <li><span className="font-semibold">Analytics data:</span> retained for 24 months</li>
          <li><span className="font-semibold">Marketplace listings:</span> retained until you delete them or your account is closed</li>
        </ul>
        <p className="mt-2">After retention periods expire, data is securely deleted or anonymized.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Data Sharing &amp; International Transfers</h2>
        <p>We do not sell your personal data. We may share data with:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Supabase</span> (database and storage) — servers located in EU and USA</li>
          <li><span className="font-semibold">Vercel</span> (hosting) — servers located in USA</li>
          <li><span className="font-semibold">Google</span> (OAuth authentication and analytics)</li>
          <li><span className="font-semibold">Brevo/Sendinblue</span> (email delivery)</li>
        </ul>
        <p className="mt-2">For transfers to the USA (Vercel, Google), we rely on Standard Contractual Clauses (SCCs) as the transfer mechanism under GDPR Chapter V.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Your Rights Under GDPR</h2>
        <p>As a data subject, you have the following rights:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Right of access (Art. 15):</span> request a copy of your personal data</li>
          <li><span className="font-semibold">Right to rectification (Art. 16):</span> correct inaccurate data</li>
          <li><span className="font-semibold">Right to erasure (Art. 17):</span> request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
          <li><span className="font-semibold">Right to restriction (Art. 18):</span> limit how we process your data</li>
          <li><span className="font-semibold">Right to data portability (Art. 20):</span> receive your data in a structured format</li>
          <li><span className="font-semibold">Right to object (Art. 21):</span> object to processing based on legitimate interests</li>
          <li><span className="font-semibold">Right to withdraw consent:</span> at any time, without affecting prior processing</li>
        </ul>
        <p className="mt-2">To exercise any of these rights, contact us at <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>. We will respond within 30 days.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Children&apos;s Privacy</h2>
        <p>Our Service is designed to help parents find activities for children, but is directed at adults (parents and guardians), not children directly. We do not knowingly collect personal data from individuals under 16 years of age. If you believe a child has provided us personal data, please contact us and we will delete it promptly.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your data, including:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Row-Level Security (RLS) in our database</li>
          <li>HTTPS encryption for all data in transit</li>
          <li>Secure password hashing</li>
          <li>Rate limiting and input sanitization</li>
        </ul>
        <p className="mt-2">No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Supervisory Authority</h2>
        <p>You have the right to lodge a complaint with the Romanian data protection supervisory authority:</p>
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="font-semibold">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
          <p className="mt-1">Website: <a href="https://www.anspdcp.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">www.anspdcp.ro</a></p>
          <p>Phone: 0318.059.211</p>
          <p>Address: Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, 010336 Bucharest, Romania</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the Service. The &ldquo;Last updated&rdquo; date at the top reflects the most recent revision.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">13. Contact Us</h2>
        <p>For any questions, requests, or concerns regarding this Privacy Policy:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a></li>
          <li>Website: www.moosey.ro</li>
        </ul>
      </section>
    </div>
  );
}

function VersionRO() {
  return (
    <div className="text-gray-700 leading-relaxed">
      <p className="text-sm text-gray-400 mb-8">Ultima actualizare: 23 Aprilie 2026</p>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Introducere</h2>
        <p>Această Politică de Confidențialitate descrie modul în care Moosey colectează, utilizează și protejează datele dumneavoastră personale atunci când utilizați site-ul nostru disponibil la adresa www.moosey.ro. Ne angajăm să vă protejăm confidențialitatea în conformitate cu Regulamentul General privind Protecția Datelor (UE) 2016/679 (&ldquo;GDPR&rdquo;) și Legea nr. 190/2018 privind implementarea GDPR în România.</p>
        <p className="mt-2">Prin utilizarea Serviciului nostru, sunteți de acord cu colectarea și utilizarea informațiilor conform prezentei Politici.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. Operatorul de Date</h2>
        <p>Operatorul de date responsabil pentru datele dumneavoastră personale este:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Platforma Moosey</li>
          <li>Website: www.moosey.ro</li>
          <li>Email contact: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. Datele pe care le Colectăm</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Date de Cont</h3>
        <p>Când vă creați un cont, colectăm:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Nume și prenume</li>
          <li>Adresă de email</li>
          <li>Fotografie de profil (opțional, prin Google OAuth)</li>
          <li>Date de autentificare (parolă criptată sau token OAuth)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 Conținut Generat de Utilizatori</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Listinguri de activități pe care le adăugați sau revendicați</li>
          <li>Recenzii și evaluări lăsate pe platformă</li>
          <li>Fotografii încărcate la listinguri sau pe marketplace</li>
          <li>Anunțuri marketplace (titlu, descriere, preț, fotografii)</li>
          <li>Mesaje trimise prin sistemul intern de mesagerie</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 Date de Utilizare</h3>
        <p>Date colectate automat:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Adresă IP și tip de browser</li>
          <li>Paginile vizitate și timpul petrecut</li>
          <li>Tipul de dispozitiv și sistemul de operare</li>
          <li>URL-uri de proveniență</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Cookie-uri și Urmărire</h3>
        <p>Utilizăm următoarele tipuri de cookie-uri:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Cookie-uri esențiale:</span> necesare pentru autentificare și securitate</li>
          <li><span className="font-semibold">Cookie-uri funcționale:</span> rețin preferințele și autentificarea</li>
          <li><span className="font-semibold">Cookie-uri analitice:</span> Google Analytics — pentru a înțelege cum este utilizat site-ul</li>
        </ul>
        <p className="mt-2">Cookie-urile analitice sunt utilizate numai cu consimțământul dvs. Puteți retrage consimțământul oricând prin setările browserului sau contactându-ne.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Temeiul Legal al Prelucrării</h2>
        <p>Prelucrăm datele dvs. personale în baza următoarelor temeiuri legale conform <span className="font-semibold">Art. 6 GDPR</span>:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Executarea unui contract (Art. 6(1)(b)):</span> pentru a vă oferi acces la Serviciu</li>
          <li><span className="font-semibold">Interese legitime (Art. 6(1)(f)):</span> pentru îmbunătățirea platformei și prevenirea fraudei</li>
          <li><span className="font-semibold">Consimțământ (Art. 6(1)(a)):</span> pentru cookie-uri analitice și emailuri de marketing</li>
          <li><span className="font-semibold">Obligație legală (Art. 6(1)(c)):</span> când este impus de legea română sau europeană</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. Cum Utilizăm Datele</h2>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Pentru crearea și gestionarea contului dvs.</li>
          <li>Pentru a vă permite să postați listinguri, recenzii și anunțuri marketplace</li>
          <li>Pentru a facilita comunicarea între utilizatori</li>
          <li>Pentru trimiterea de emailuri tranzacționale (confirmare cont, resetare parolă)</li>
          <li>Pentru trimiterea de newslettere și actualizări (doar cu consimțământul dvs.)</li>
          <li>Pentru îmbunătățirea și analiza utilizării Serviciului</li>
          <li>Pentru prevenirea fraudei și asigurarea securității platformei</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Perioada de Retenție</h2>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Date de cont:</span> reținute pe durata contului + 24 de luni după închidere</li>
          <li><span className="font-semibold">Mesaje:</span> reținute 24 de luni</li>
          <li><span className="font-semibold">Date analitice:</span> reținute 24 de luni</li>
          <li><span className="font-semibold">Anunțuri marketplace:</span> reținute până la ștergerea lor sau închiderea contului</li>
        </ul>
        <p className="mt-2">La expirarea perioadelor de retenție, datele sunt șterse în condiții de securitate sau anonimizate.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Partajarea Datelor și Transferuri Internaționale</h2>
        <p>Nu vindem datele dvs. personale. Putem partaja date cu:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Supabase</span> (baza de date și stocare) — servere în UE și SUA</li>
          <li><span className="font-semibold">Vercel</span> (hosting) — servere în SUA</li>
          <li><span className="font-semibold">Google</span> (autentificare OAuth și analize)</li>
          <li><span className="font-semibold">Brevo/Sendinblue</span> (livrare emailuri)</li>
        </ul>
        <p className="mt-2">Pentru transferurile către SUA (Vercel, Google), ne bazăm pe Clauze Contractuale Standard (SCC) ca mecanism de transfer conform <span className="font-semibold">Capitolului V GDPR</span>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Drepturile Dvs. Conform GDPR</h2>
        <p>În calitate de persoană vizată, aveți următoarele drepturi:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Dreptul de acces (Art. 15):</span> solicitați o copie a datelor dvs. personale</li>
          <li><span className="font-semibold">Dreptul la rectificare (Art. 16):</span> corectați datele inexacte</li>
          <li><span className="font-semibold">Dreptul la ștergere (Art. 17):</span> solicitați ștergerea datelor (&ldquo;dreptul de a fi uitat&rdquo;)</li>
          <li><span className="font-semibold">Dreptul la restricționarea prelucrării (Art. 18):</span> limitați modul în care vă prelucrăm datele</li>
          <li><span className="font-semibold">Dreptul la portabilitatea datelor (Art. 20):</span> primiți datele dvs. într-un format structurat</li>
          <li><span className="font-semibold">Dreptul la opoziție (Art. 21):</span> vă opuneți prelucrării bazate pe interese legitime</li>
          <li><span className="font-semibold">Dreptul de a retrage consimțământul:</span> oricând, fără a afecta prelucrarea anterioară</li>
        </ul>
        <p className="mt-2">Pentru exercitarea oricăruia dintre aceste drepturi, contactați-ne la <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>. Vom răspunde în termen de 30 de zile.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Confidențialitatea Copiilor</h2>
        <p>Serviciul nostru este conceput pentru a ajuta părinții să găsească activități pentru copii, dar se adresează adulților (părinți și tutori), nu copiilor direct. Nu colectăm cu bună știință date personale de la persoane sub 16 ani. Dacă credeți că un copil ne-a furnizat date personale, contactați-ne și le vom șterge imediat.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Securitate</h2>
        <p>Implementăm măsuri tehnice și organizatorice adecvate pentru protecția datelor dvs., inclusiv:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Securitate la nivel de rând (RLS) în baza de date</li>
          <li>Criptare HTTPS pentru toate datele în tranzit</li>
          <li>Criptare securizată a parolelor</li>
          <li>Limitare a ratei de acces și sanitizare a intrărilor</li>
        </ul>
        <p className="mt-2">Nicio metodă de transmitere prin Internet nu este 100% sigură. Nu putem garanta securitatea absolută.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Autoritatea de Supraveghere</h2>
        <p>Aveți dreptul să depuneți o plângere la autoritatea română de supraveghere a protecției datelor:</p>
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="font-semibold">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
          <p className="mt-1">Website: <a href="https://www.anspdcp.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">www.anspdcp.ro</a></p>
          <p>Telefon: 0318.059.211</p>
          <p>Adresă: Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, 010336 București, România</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Modificări ale Acestei Politici</h2>
        <p>Putem actualiza această Politică de Confidențialitate periodic. Vă vom notifica cu privire la modificările semnificative prin email sau printr-un anunț pe Serviciu. Data &ldquo;Ultima actualizare&rdquo; de la începutul documentului reflectă cea mai recentă revizuire.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">13. Contactați-ne</h2>
        <p>Pentru orice întrebări, solicitări sau nelămuriri privind această Politică de Confidențialitate:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a></li>
          <li>Website: www.moosey.ro</li>
        </ul>
      </section>
    </div>
  );
}

export default function PrivacyContent() {
  const [lang, setLang] = useState<'ro' | 'en'>('ro');
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#ff5a2e] transition-colors mb-6">
          {lang === 'ro' ? '← Înapoi acasă' : '← Back home'}
        </Link>

        <div className="flex justify-end gap-2 mb-8">
          <button onClick={() => setLang('ro')} className={lang === 'ro' ? 'text-[#ff5a2e] font-semibold' : 'text-gray-400 hover:text-gray-600'}>RO</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-[#ff5a2e] font-semibold' : 'text-gray-400 hover:text-gray-600'}>EN</button>
        </div>

        <h1 className="font-display text-4xl font-bold text-[#1a1a2e] leading-tight mb-4">
          {lang === 'ro' ? 'Politică de Confidențialitate' : 'Privacy Policy'}
        </h1>

        {lang === 'ro' ? <VersionRO /> : <VersionEN />}
      </main>
    </div>
  );
}
