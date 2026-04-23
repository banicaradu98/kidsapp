'use client';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

function VersionEN() {
  return (
    <div className="text-gray-700 leading-relaxed">
      <p className="text-sm text-gray-400 mb-8">Last updated: April 23, 2026</p>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Who We Are</h2>
        <p>Moosey operates the platform available at www.moosey.ro — an online directory and community platform for parents and families in Sibiu, Romania.</p>
        <p className="mt-2">For the purposes of the General Data Protection Regulation (EU) 2016/679 (&ldquo;GDPR&rdquo;) and Romanian Law no. 190/2018, Moosey acts as the Data Controller for personal data collected through the Service.</p>
        <p className="mt-2">Contact: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. Legal Basis for Processing</h2>
        <p>We process personal data based on the following legal grounds under <span className="font-semibold">GDPR Article 6</span>:</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.1 Contract Performance — <span className="font-semibold">Art. 6(1)(b)</span></h3>
        <p>We process your data to fulfill our contractual obligations to you, including:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Creating and managing your user account</li>
          <li>Allowing you to post listings, reviews, and marketplace ads</li>
          <li>Enabling communication between users via the internal messaging system</li>
          <li>Providing access to platform features as a registered user</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.2 Legitimate Interests — <span className="font-semibold">Art. 6(1)(f)</span></h3>
        <p>We process certain data based on our legitimate interests in operating a safe and functional platform:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Fraud prevention and platform security</li>
          <li>Improving and analyzing platform usage</li>
          <li>Server logs and IP address processing for security monitoring</li>
        </ul>
        <p className="mt-2">We have conducted a balancing test and determined that our legitimate interests do not override your fundamental rights and freedoms.</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.3 Consent — <span className="font-semibold">Art. 6(1)(a)</span></h3>
        <p>We rely on your explicit consent for:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Analytics cookies (Google Analytics)</li>
          <li>Marketing emails and newsletters</li>
        </ul>
        <p className="mt-2">You may withdraw consent at any time without affecting the lawfulness of processing before withdrawal. To withdraw: email <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a> or update your browser cookie settings.</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.4 Legal Obligation — <span className="font-semibold">Art. 6(1)(c)</span></h3>
        <p>We may process data when required by applicable Romanian or EU law, such as retaining financial records for tax authorities.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. Categories of Personal Data Processed</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Identity &amp; Contact Data</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Full name</li>
          <li>Email address</li>
          <li>Profile photo (optional)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 Authentication Data</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Hashed password (we never store plain-text passwords)</li>
          <li>OAuth tokens (for Google login)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 User-Generated Content</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Listings, reviews, and ratings you create</li>
          <li>Photos you upload</li>
          <li>Marketplace listings and messages</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Technical &amp; Usage Data</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Pages visited and time spent</li>
          <li>Referring URLs</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.5 Cookie Data</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Session cookies (essential — no consent required)</li>
          <li>Functional cookies (remember preferences — no consent required)</li>
          <li>Analytics cookies via Google Analytics (consent required)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Data Retention Periods</h2>
        <p>We apply the following maximum retention periods:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Account data:</span> duration of account + 24 months after closure</li>
          <li><span className="font-semibold">User-generated content:</span> until you delete it or your account is closed</li>
          <li><span className="font-semibold">Internal messages:</span> 24 months from the date of the message</li>
          <li><span className="font-semibold">Analytics data (Google Analytics):</span> 24 months</li>
          <li><span className="font-semibold">Server logs:</span> 24 months for security purposes</li>
          <li><span className="font-semibold">Financial/billing records:</span> 10 years as required by Romanian tax law (Law 227/2015)</li>
        </ul>
        <p className="mt-2">After retention periods expire, data is securely deleted or irreversibly anonymized. Anonymized statistical data may be retained indefinitely.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. International Data Transfers</h2>
        <p>Some of our service providers are located outside the European Economic Area (EEA), specifically in the United States. We rely on the following safeguards:</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.1 Supabase (Database &amp; Storage)</h3>
        <p>Supabase processes data on servers in the EU (Frankfurt) and USA. Transfers to the USA are covered by Standard Contractual Clauses (SCCs) as per <span className="font-semibold">GDPR Chapter V</span>.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.2 Vercel (Hosting &amp; CDN)</h3>
        <p>Vercel hosts the platform on servers in the USA. Transfers are covered by Standard Contractual Clauses (SCCs).</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.3 Google (Authentication &amp; Analytics)</h3>
        <p>Google processes OAuth authentication data and analytics. Google participates in the EU-US Data Privacy Framework (DPF), which the European Commission has recognized as providing adequate protection.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.4 Brevo/Sendinblue (Email Delivery)</h3>
        <p>Brevo processes email addresses for transactional emails and newsletters. Brevo is based in the EU (France) and complies with GDPR.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Your Rights as a Data Subject</h2>
        <p>Under <span className="font-semibold">GDPR Chapter III</span>, you have the following rights:</p>
        <div className="space-y-4 mt-4">
          <div><p className="font-semibold">Right of Access — Art. 15</p><p className="mt-1">You may request a copy of all personal data we hold about you, including information about how it is processed.</p></div>
          <div><p className="font-semibold">Right to Rectification — Art. 16</p><p className="mt-1">You may request correction of inaccurate or incomplete personal data.</p></div>
          <div><p className="font-semibold">Right to Erasure — Art. 17 (Right to be Forgotten)</p><p className="mt-1">You may request deletion of your personal data where: it is no longer necessary for the purpose collected; you withdraw consent; you object to processing; or processing was unlawful.</p></div>
          <div><p className="font-semibold">Right to Restriction of Processing — Art. 18</p><p className="mt-1">You may request that we limit processing of your data in certain circumstances (e.g., while we verify accuracy of a rectification request).</p></div>
          <div><p className="font-semibold">Right to Data Portability — Art. 20</p><p className="mt-1">You may request your personal data in a structured, commonly used, machine-readable format (JSON or CSV) to transfer to another service.</p></div>
          <div><p className="font-semibold">Right to Object — Art. 21</p><p className="mt-1">You may object to processing based on legitimate interests <span className="font-semibold">(Art. 6(1)(f))</span>. We will cease processing unless we can demonstrate compelling legitimate grounds.</p></div>
          <div><p className="font-semibold">Right to Withdraw Consent — Art. 7(3)</p><p className="mt-1">Where processing is based on consent, you may withdraw it at any time. Withdrawal does not affect the lawfulness of prior processing.</p></div>
          <div><p className="font-semibold">Rights Related to Automated Decision-Making — Art. 22</p><p className="mt-1">Moosey does not use automated decision-making or profiling that produces legal effects or significantly affects you.</p></div>
        </div>
        <p className="mt-4">To exercise any of these rights, contact us at <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>. We will respond within 30 calendar days. If the request is complex, we may extend this by a further 2 months with notice.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Cookies</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.1 What Are Cookies</h3>
        <p>Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and understand how you use it.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.2 Cookies We Use</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Strictly necessary cookies:</span> required for the site to function (authentication, security). Legal basis: legitimate interest. Cannot be disabled.</li>
          <li><span className="font-semibold">Functional cookies:</span> remember your login and preferences. Legal basis: legitimate interest.</li>
          <li><span className="font-semibold">Analytics cookies (Google Analytics):</span> track how visitors use the site. Legal basis: consent. Can be disabled.</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.3 Managing Cookies</h3>
        <p>You can manage cookies through your browser settings. Disabling certain cookies may affect site functionality. To opt out of Google Analytics specifically, you can install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">Google Analytics Opt-out Browser Add-on</a>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Data Security</h2>
        <p>We implement appropriate technical and organizational measures including:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Row-Level Security (RLS) — database access controls so users can only see their own data</li>
          <li>HTTPS encryption — all data transmitted between your browser and our servers is encrypted</li>
          <li>Secure password hashing — passwords are never stored in plain text</li>
          <li>Rate limiting and input sanitization — protection against automated attacks</li>
          <li>Regular security reviews of our infrastructure</li>
        </ul>
        <p className="mt-2">Despite these measures, no internet transmission is 100% secure. We cannot guarantee absolute security and will notify you and the relevant authorities in case of a data breach as required by <span className="font-semibold">GDPR Art. 33-34</span>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Data Breach Notification</h2>
        <p>In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Notify the ANSPDCP within 72 hours of becoming aware of the breach <span className="font-semibold">(GDPR Art. 33)</span></li>
          <li>Notify affected individuals without undue delay if the breach is likely to result in a high risk <span className="font-semibold">(GDPR Art. 34)</span></li>
          <li>Document all breaches in our internal breach register</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Supervisory Authority</h2>
        <p>You have the right to lodge a complaint with the Romanian data protection supervisory authority if you believe your personal data has been processed unlawfully:</p>
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="font-semibold">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
          <p className="mt-1">Website: <a href="https://www.anspdcp.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">www.anspdcp.ro</a></p>
          <p>Phone: 0318.059.211</p>
          <p>Email: <a href="mailto:anspdcp@dataprotection.ro" className="text-[#ff5a2e] underline">anspdcp@dataprotection.ro</a></p>
          <p>Address: Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, 010336 Bucharest, Romania</p>
        </div>
        <p className="mt-3">You may also lodge a complaint with the supervisory authority in your EU country of residence.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Changes to This Notice</h2>
        <p>We may update this GDPR Information Notice periodically. Significant changes will be communicated via email or a prominent notice on the Service. The date at the top of this document reflects the most recent update.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Contact</h2>
        <p>For any data protection questions or to exercise your rights:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a></li>
          <li>Website: www.moosey.ro</li>
          <li>Response time: within 30 calendar days</li>
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
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Cine Suntem</h2>
        <p>Moosey operează platforma disponibilă la adresa www.moosey.ro — un director online și o platformă comunitară pentru părinți și familii din Sibiu, România.</p>
        <p className="mt-2">În sensul Regulamentului General privind Protecția Datelor (UE) 2016/679 (&ldquo;GDPR&rdquo;) și al Legii nr. 190/2018, Moosey acționează ca Operator de Date pentru datele personale colectate prin intermediul Serviciului.</p>
        <p className="mt-2">Contact: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. Temeiul Legal al Prelucrării</h2>
        <p>Prelucrăm datele personale în baza următoarelor temeiuri legale conform <span className="font-semibold">Art. 6 GDPR</span>:</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.1 Executarea unui Contract — <span className="font-semibold">Art. 6(1)(b)</span></h3>
        <p>Prelucrăm datele dvs. pentru a ne îndeplini obligațiile contractuale față de dvs., inclusiv:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Crearea și gestionarea contului dvs. de utilizator</li>
          <li>Permiterea postării de listinguri, recenzii și anunțuri marketplace</li>
          <li>Facilitarea comunicării între utilizatori prin sistemul intern de mesagerie</li>
          <li>Acordarea accesului la funcționalitățile platformei ca utilizator înregistrat</li>
        </ul>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.2 Interese Legitime — <span className="font-semibold">Art. 6(1)(f)</span></h3>
        <p>Prelucrăm anumite date în baza intereselor noastre legitime de a opera o platformă sigură și funcțională:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Prevenirea fraudei și securitatea platformei</li>
          <li>Îmbunătățirea și analiza utilizării platformei</li>
          <li>Jurnalele de server și prelucrarea adreselor IP pentru monitorizarea securității</li>
        </ul>
        <p className="mt-2">Am efectuat un test de echilibrare și am determinat că interesele noastre legitime nu prevalează asupra drepturilor și libertăților dvs. fundamentale.</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.3 Consimțământ — <span className="font-semibold">Art. 6(1)(a)</span></h3>
        <p>Ne bazăm pe consimțământul dvs. explicit pentru:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Cookie-uri analitice (Google Analytics)</li>
          <li>Emailuri de marketing și newslettere</li>
        </ul>
        <p className="mt-2">Puteți retrage consimțământul oricând, fără a afecta legalitatea prelucrării anterioare. Pentru retragere: trimiteți email la <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a> sau actualizați setările cookie din browser.</p>

        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.4 Obligație Legală — <span className="font-semibold">Art. 6(1)(c)</span></h3>
        <p>Putem prelucra date când este cerut de legea română sau europeană aplicabilă, cum ar fi păstrarea evidențelor financiare pentru autoritățile fiscale.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. Categorii de Date Personale Prelucrate</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Date de Identitate și Contact</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Nume și prenume</li>
          <li>Adresă de email</li>
          <li>Fotografie de profil (opțional)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 Date de Autentificare</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Parolă criptată (nu stocăm niciodată parole în text simplu)</li>
          <li>Token-uri OAuth (pentru autentificarea cu Google)</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 Conținut Generat de Utilizatori</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Listinguri, recenzii și evaluări create de dvs.</li>
          <li>Fotografii încărcate</li>
          <li>Anunțuri marketplace și mesaje</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Date Tehnice și de Utilizare</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Adresă IP</li>
          <li>Tip și versiune de browser</li>
          <li>Tip de dispozitiv și sistem de operare</li>
          <li>Paginile vizitate și timpul petrecut</li>
          <li>URL-uri de proveniență</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.5 Date Cookie</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Cookie-uri de sesiune (esențiale — nu necesită consimțământ)</li>
          <li>Cookie-uri funcționale (rețin preferințele — nu necesită consimțământ)</li>
          <li>Cookie-uri analitice prin Google Analytics (necesită consimțământ)</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Perioade de Retenție a Datelor</h2>
        <p>Aplicăm următoarele perioade maxime de retenție:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Date de cont:</span> durata contului + 24 de luni după închidere</li>
          <li><span className="font-semibold">Conținut generat de utilizatori:</span> până la ștergerea sa sau închiderea contului</li>
          <li><span className="font-semibold">Mesaje interne:</span> 24 de luni de la data mesajului</li>
          <li><span className="font-semibold">Date analitice (Google Analytics):</span> 24 de luni</li>
          <li><span className="font-semibold">Jurnale de server:</span> 24 de luni în scopuri de securitate</li>
          <li><span className="font-semibold">Evidențe financiare/de facturare:</span> 10 ani conform legii fiscale române (Legea 227/2015)</li>
        </ul>
        <p className="mt-2">La expirarea perioadelor de retenție, datele sunt șterse în condiții de securitate sau anonimizate ireversibil. Datele statistice anonimizate pot fi păstrate pe termen nedefinit.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. Transferuri Internaționale de Date</h2>
        <p>Unii dintre furnizorii noștri de servicii sunt localizați în afara Spațiului Economic European (SEE), în special în Statele Unite. Ne bazăm pe următoarele garanții:</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.1 Supabase (Bază de Date și Stocare)</h3>
        <p>Supabase prelucrează date pe servere în UE (Frankfurt) și SUA. Transferurile către SUA sunt acoperite de Clauze Contractuale Standard (SCC) conform <span className="font-semibold">Capitolului V GDPR</span>.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.2 Vercel (Hosting și CDN)</h3>
        <p>Vercel găzduiește platforma pe servere în SUA. Transferurile sunt acoperite de Clauze Contractuale Standard (SCC).</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.3 Google (Autentificare și Analize)</h3>
        <p>Google prelucrează date de autentificare OAuth și date analitice. Google participă la Cadrul de Confidențialitate a Datelor UE-SUA (DPF), recunoscut de Comisia Europeană ca oferind protecție adecvată.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.4 Brevo/Sendinblue (Livrare Email)</h3>
        <p>Brevo prelucrează adrese de email pentru emailuri tranzacționale și newslettere. Brevo este cu sediul în UE (Franța) și respectă GDPR.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Drepturile Dvs. ca Persoană Vizată</h2>
        <p>Conform <span className="font-semibold">Capitolului III GDPR</span>, aveți următoarele drepturi:</p>
        <div className="space-y-4 mt-4">
          <div><p className="font-semibold">Dreptul de Acces — Art. 15</p><p className="mt-1">Puteți solicita o copie a tuturor datelor personale pe care le deținem despre dvs., inclusiv informații despre modul în care sunt prelucrate.</p></div>
          <div><p className="font-semibold">Dreptul la Rectificare — Art. 16</p><p className="mt-1">Puteți solicita corectarea datelor personale inexacte sau incomplete.</p></div>
          <div><p className="font-semibold">Dreptul la Ștergere — Art. 17 (Dreptul de a fi Uitat)</p><p className="mt-1">Puteți solicita ștergerea datelor dvs. personale atunci când: nu mai sunt necesare scopului pentru care au fost colectate; retrageți consimțământul; vă opuneți prelucrării; sau prelucrarea a fost ilegală.</p></div>
          <div><p className="font-semibold">Dreptul la Restricționarea Prelucrării — Art. 18</p><p className="mt-1">Puteți solicita limitarea prelucrării datelor dvs. în anumite circumstanțe (ex.: în timp ce verificăm acuratețea unei cereri de rectificare).</p></div>
          <div><p className="font-semibold">Dreptul la Portabilitatea Datelor — Art. 20</p><p className="mt-1">Puteți solicita datele dvs. personale într-un format structurat, utilizat frecvent și care poate fi citit automat (JSON sau CSV) pentru a le transfera la un alt serviciu.</p></div>
          <div><p className="font-semibold">Dreptul la Opoziție — Art. 21</p><p className="mt-1">Vă puteți opune prelucrării bazate pe interese legitime <span className="font-semibold">(Art. 6(1)(f))</span>. Vom înceta prelucrarea dacă nu putem demonstra motive legitime imperioase.</p></div>
          <div><p className="font-semibold">Dreptul de a Retrage Consimțământul — Art. 7(3)</p><p className="mt-1">Acolo unde prelucrarea se bazează pe consimțământ, îl puteți retrage oricând. Retragerea nu afectează legalitatea prelucrării anterioare.</p></div>
          <div><p className="font-semibold">Drepturi Legate de Decizia Automată — Art. 22</p><p className="mt-1">Moosey nu utilizează luarea de decizii automatizată sau profilare care produce efecte juridice sau vă afectează semnificativ.</p></div>
        </div>
        <p className="mt-4">Pentru a exercita oricare dintre aceste drepturi, contactați-ne la <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a>. Vom răspunde în termen de 30 de zile calendaristice. Dacă cererea este complexă, putem prelungi cu încă 2 luni cu notificare prealabilă.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Cookie-uri</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.1 Ce Sunt Cookie-urile</h3>
        <p>Cookie-urile sunt fișiere text mici stocate pe dispozitivul dvs. când vizitați un site web. Ajută site-ul să vă rețină preferințele și să înțeleagă cum îl utilizați.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.2 Cookie-urile pe care le Folosim</h3>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Cookie-uri strict necesare:</span> necesare pentru funcționarea site-ului (autentificare, securitate). Temei legal: interes legitim. Nu pot fi dezactivate.</li>
          <li><span className="font-semibold">Cookie-uri funcționale:</span> rețin autentificarea și preferințele dvs. Temei legal: interes legitim.</li>
          <li><span className="font-semibold">Cookie-uri analitice (Google Analytics):</span> urmăresc modul în care vizitatorii utilizează site-ul. Temei legal: consimțământ. Pot fi dezactivate.</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.3 Gestionarea Cookie-urilor</h3>
        <p>Puteți gestiona cookie-urile prin setările browserului. Dezactivarea anumitor cookie-uri poate afecta funcționalitatea site-ului. Pentru a renunța specific la Google Analytics, puteți instala <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">Add-on-ul de renunțare la Google Analytics</a>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Securitatea Datelor</h2>
        <p>Implementăm măsuri tehnice și organizatorice adecvate, inclusiv:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Securitate la nivel de rând (RLS) — controale de acces la baza de date astfel încât utilizatorii să vadă doar propriile date</li>
          <li>Criptare HTTPS — toate datele transmise între browserul dvs. și serverele noastre sunt criptate</li>
          <li>Criptare securizată a parolelor — parolele nu sunt stocate niciodată în text simplu</li>
          <li>Limitarea ratei de acces și sanitizarea intrărilor — protecție împotriva atacurilor automate</li>
          <li>Revizuiri periodice de securitate ale infrastructurii noastre</li>
        </ul>
        <p className="mt-2">În ciuda acestor măsuri, nicio transmisie prin internet nu este 100% sigură. Nu putem garanta securitatea absolută și vă vom notifica, împreună cu autoritățile relevante, în cazul unei breșe de date conform <span className="font-semibold">Art. 33-34 GDPR</span>.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Notificarea Breșelor de Date</h2>
        <p>În cazul unei breșe de date personale care poate genera un risc pentru drepturile și libertățile dvs., vom:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Notifica ANSPDCP în termen de 72 de ore de la constatarea breșei <span className="font-semibold">(GDPR Art. 33)</span></li>
          <li>Notifica persoanele afectate fără întârzieri nejustificate dacă breșa poate genera un risc ridicat <span className="font-semibold">(GDPR Art. 34)</span></li>
          <li>Documenta toate breșele în registrul nostru intern de breșe</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Autoritatea de Supraveghere</h2>
        <p>Aveți dreptul să depuneți o plângere la autoritatea română de supraveghere a protecției datelor dacă considerați că datele dvs. personale au fost prelucrate ilegal:</p>
        <div className="mt-3 bg-gray-50 rounded-xl p-4">
          <p className="font-semibold">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
          <p className="mt-1">Website: <a href="https://www.anspdcp.ro" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">www.anspdcp.ro</a></p>
          <p>Telefon: 0318.059.211</p>
          <p>Email: <a href="mailto:anspdcp@dataprotection.ro" className="text-[#ff5a2e] underline">anspdcp@dataprotection.ro</a></p>
          <p>Adresă: Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, 010336 București, România</p>
        </div>
        <p className="mt-3">Puteți depune de asemenea o plângere la autoritatea de supraveghere din țara UE în care locuiți.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Modificări ale Acestei Informări</h2>
        <p>Putem actualiza această Informare GDPR periodic. Modificările semnificative vor fi comunicate prin email sau printr-un anunț prominent pe Serviciu. Data de la începutul acestui document reflectă cea mai recentă actualizare.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Contact</h2>
        <p>Pentru orice întrebări privind protecția datelor sau pentru a vă exercita drepturile:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a></li>
          <li>Website: www.moosey.ro</li>
          <li>Timp de răspuns: în termen de 30 de zile calendaristice</li>
        </ul>
      </section>
    </div>
  );
}

export default function GdprContent() {
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
          {lang === 'ro' ? 'Informare GDPR' : 'GDPR Information Notice'}
        </h1>

        {lang === 'ro' ? <VersionRO /> : <VersionEN />}
      </main>
    </div>
  );
}
