'use client';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import Link from 'next/link';

function VersionEN() {
  return (
    <div className="text-gray-700 leading-relaxed">
      <p className="text-sm text-gray-400 mb-8">Last updated: April 23, 2026</p>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Introduction &amp; Acceptance</h2>
        <p>These Terms and Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Moosey platform, available at www.moosey.ro (the &ldquo;Service&rdquo;). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.</p>
        <p className="mt-2">Moosey is an online directory and community platform for parents and families in Sibiu, Romania, listing activities, events, and marketplace offers for children. We act as an information aggregator and bulletin board — we are not a party to any transaction between users.</p>
        <p className="mt-2">You must be at least 18 years of age to use the Service.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. User Accounts</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.1 Account Creation</h3>
        <p>To access certain features, you must create an account. You agree to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain and promptly update your account information</li>
          <li>Keep your password secure and confidential</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
          <li>Be responsible for all activities that occur under your account</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.2 Account Termination</h3>
        <p>We reserve the right to suspend or terminate your account immediately, without prior notice, if you breach these Terms or engage in behavior harmful to the platform or other users.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. User-Generated Content</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Your Content</h3>
        <p>Our Service allows you to post, upload, and share content including listings, reviews, photos, and marketplace ads (&ldquo;Your Content&rdquo;). You retain ownership of Your Content, but by posting it you grant Moosey a non-exclusive, worldwide, royalty-free license to display, distribute, and promote Your Content within the Service.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 Content Standards</h3>
        <p>You agree that Your Content will NOT:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Be false, misleading, or fraudulent</li>
          <li>Infringe any third-party intellectual property rights</li>
          <li>Contain offensive, hateful, or discriminatory material</li>
          <li>Include personal data of others without their consent</li>
          <li>Promote illegal activities or products</li>
          <li>Contain spam, unsolicited advertising, or malicious code</li>
          <li>Depict minors in any inappropriate manner</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 Content Moderation</h3>
        <p>We reserve the right to remove any content that violates these Terms or that we deem inappropriate, at our sole discretion, without prior notice.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Feedback &amp; Suggestions</h3>
        <p>If you provide us with feedback, ideas, or suggestions about the Service, you agree that we may use this feedback freely and without compensation or credit to you. We appreciate your input and use it to improve the platform.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Marketplace Rules</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.1 Nature of the Marketplace</h3>
        <p>Moosey Marketplace is a bulletin board service connecting buyers and sellers of second-hand children&apos;s items in Sibiu. Moosey is NOT a party to any transaction and does NOT:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Guarantee the quality, safety, or legality of items listed</li>
          <li>Guarantee the accuracy of listings</li>
          <li>Facilitate payments or handle money</li>
          <li>Arrange or guarantee delivery or pickup</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.2 Seller Responsibilities</h3>
        <p>As a seller, you agree to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Provide accurate descriptions and photos of items</li>
          <li>Honor agreed prices and terms</li>
          <li>Meet buyers in safe, public locations for exchanges</li>
          <li>Not list prohibited items (weapons, drugs, counterfeit goods, etc.)</li>
          <li>Remove listings once items are sold or donated</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.3 Buyer Responsibilities</h3>
        <p>As a buyer, you agree to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Inspect items before completing any exchange</li>
          <li>Communicate respectfully with sellers</li>
          <li>Not misuse the messaging system</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.4 Limitation of Liability for Marketplace Transactions</h3>
        <p>ALL TRANSACTIONS ARE STRICTLY BETWEEN BUYERS AND SELLERS. Moosey expressly disclaims any liability for disputes, losses, damages, or fraud arising from marketplace transactions. We strongly recommend meeting in public places and exercising caution.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. Subscription Plans &amp; Organizer Packages</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.1 Free and Paid Plans</h3>
        <p>Moosey offers both free and paid organizer packages:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Free plan:</span> basic listing with verified badge</li>
          <li><span className="font-semibold">Standard plan:</span> featured placement in category</li>
          <li><span className="font-semibold">Pro plan:</span> featured placement on homepage</li>
          <li><span className="font-semibold">Premium plan:</span> full featured placement and monthly reports</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.2 Billing &amp; Cancellation</h3>
        <p>Paid subscriptions are billed monthly. You may cancel at any time. Cancellation takes effect at the end of the current billing period. We do not offer refunds for partial months.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.3 Price Changes</h3>
        <p>We reserve the right to change subscription prices with 30 days advance notice. Continued use of the Service after price changes constitutes acceptance of the new prices.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Promotions &amp; Contests</h2>
        <p>From time to time, Moosey may offer promotions, contests, or sweepstakes. Each promotion will be governed by its own specific rules, which will be posted on the Service. We reserve the right to cancel or modify any promotion at our discretion.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Intellectual Property</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.1 Moosey Content</h3>
        <p>The Moosey name, logo, visual design, mascot (the moose character), and all platform content created by us are our exclusive intellectual property, protected by copyright, trademark, and other applicable laws. You may not use, copy, reproduce, or distribute our content without express written permission.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.2 Your Content</h3>
        <p>You retain all rights to content you create and upload. By posting content on Moosey, you confirm you have the right to share it and grant us the license described in Section 3.1.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by Romanian and EU law:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Moosey is provided on an AS IS and AS AVAILABLE basis without warranties of any kind</li>
          <li>We do not guarantee uninterrupted, error-free operation of the Service</li>
          <li>We are not liable for any indirect, incidental, or consequential damages</li>
          <li>Our total liability to you shall not exceed 100 EUR or the amount you paid us in the last 12 months, whichever is greater</li>
        </ul>
        <p className="mt-2">Nothing in these Terms limits liability for death, personal injury caused by negligence, or fraud, as required by Romanian law.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Links to Third-Party Websites</h2>
        <p>Our Service may contain links to third-party websites (including event organizers, activity providers, and social media). We have no control over and assume no responsibility for the content or practices of any third-party sites. We strongly advise you to review their terms and privacy policies.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Governing Law &amp; Dispute Resolution</h2>
        <p>These Terms are governed by the laws of Romania, excluding conflicts of law rules. Any disputes shall be resolved:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>First: through informal negotiation by contacting us at <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></li>
          <li>Second: through mediation if informal resolution fails</li>
          <li>Third: through the competent Romanian courts, specifically those in Sibiu</li>
        </ul>
        <p className="mt-2">If you are an EU consumer, you may also use the EU Online Dispute Resolution platform at: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">ec.europa.eu/consumers/odr</a></p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Changes to These Terms</h2>
        <p>We reserve the right to modify these Terms at any time. For material changes, we will provide at least 30 days notice via email or a prominent notice on the Service. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Severability</h2>
        <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">13. Contact Us</h2>
        <p>For any questions about these Terms and Conditions:</p>
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
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">1. Introducere și Acceptare</h2>
        <p>Acești Termeni și Condiții guvernează accesul și utilizarea platformei Moosey, disponibilă la adresa www.moosey.ro. Prin accesarea sau utilizarea Serviciului, acceptați să fiți legat de acești Termeni. Dacă nu sunteți de acord cu oricare parte a acestor Termeni, nu puteți accesa Serviciul.</p>
        <p className="mt-2">Moosey este un director online și o platformă comunitară pentru părinți și familii din Sibiu, România, care listează activități, evenimente și oferte marketplace pentru copii. Acționăm ca un agregator de informații și avizier — nu suntem parte la nicio tranzacție între utilizatori.</p>
        <p className="mt-2">Trebuie să aveți cel puțin 18 ani pentru a utiliza Serviciul.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">2. Conturi de Utilizator</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.1 Crearea Contului</h3>
        <p>Pentru a accesa anumite funcționalități, trebuie să creați un cont. Sunteți de acord să:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Furnizați informații corecte, actuale și complete la înregistrare</li>
          <li>Mențineți și actualizați prompt informațiile contului dvs.</li>
          <li>Păstrați parola în siguranță și confidențială</li>
          <li>Ne notificați imediat despre orice utilizare neautorizată a contului dvs.</li>
          <li>Fiți responsabil pentru toate activitățile desfășurate sub contul dvs.</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">2.2 Suspendarea Contului</h3>
        <p>Ne rezervăm dreptul de a suspenda sau rezilia contul dvs. imediat, fără notificare prealabilă, dacă încălcați acești Termeni sau vă comportați într-un mod dăunător platformei sau altor utilizatori.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">3. Conținut Generat de Utilizatori</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.1 Conținutul Dvs.</h3>
        <p>Serviciul nostru vă permite să postați, să încărcați și să distribuiți conținut inclusiv listinguri, recenzii, fotografii și anunțuri marketplace. Dețineți în continuare dreptul de proprietate asupra conținutului dvs., dar prin postarea acestuia acordați Moosey o licență neexclusivă, mondială și fără redevențe pentru a afișa, distribui și promova conținutul în cadrul Serviciului.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.2 Standarde de Conținut</h3>
        <p>Sunteți de acord că conținutul dvs. NU va:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Fi fals, înșelător sau fraudulos</li>
          <li>Încălca drepturile de proprietate intelectuală ale terților</li>
          <li>Conține material ofensator, plin de ură sau discriminatoriu</li>
          <li>Include date personale ale altor persoane fără consimțământul acestora</li>
          <li>Promova activități sau produse ilegale</li>
          <li>Conține spam, publicitate nesolicitate sau cod malițios</li>
          <li>Reprezenta minori în orice manieră inadecvată</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.3 Moderarea Conținutului</h3>
        <p>Ne rezervăm dreptul de a elimina orice conținut care încalcă acești Termeni sau pe care îl considerăm inadecvat, la discreția noastră exclusivă, fără notificare prealabilă.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">3.4 Feedback și Sugestii</h3>
        <p>Dacă ne furnizați feedback, idei sau sugestii despre Serviciu, sunteți de acord că le putem utiliza în mod liber și fără compensație sau credit pentru dvs. Apreciem contribuția dvs. și o folosim pentru îmbunătățirea platformei.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">4. Regulile Marketplace</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.1 Natura Marketplace-ului</h3>
        <p>Moosey Marketplace este un serviciu de avizier care conectează cumpărătorii și vânzătorii de articole second-hand pentru copii din Sibiu. Moosey NU este parte la nicio tranzacție și NU:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Garantează calitatea, siguranța sau legalitatea articolelor listate</li>
          <li>Garantează acuratețea listingurilor</li>
          <li>Facilitează plăți sau gestionează bani</li>
          <li>Organizează sau garantează livrarea sau ridicarea produselor</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.2 Responsabilitățile Vânzătorului</h3>
        <p>În calitate de vânzător, sunteți de acord să:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Furnizați descrieri și fotografii corecte ale articolelor</li>
          <li>Respectați prețurile și termenii agreați</li>
          <li>Vă întâlniți cu cumpărătorii în locuri sigure și publice pentru schimburi</li>
          <li>Nu listați articole interzise (arme, droguri, produse contrafăcute etc.)</li>
          <li>Eliminați listingurile odată ce articolele sunt vândute sau donate</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.3 Responsabilitățile Cumpărătorului</h3>
        <p>În calitate de cumpărător, sunteți de acord să:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Inspectați articolele înainte de a finaliza orice schimb</li>
          <li>Comunicați respectuos cu vânzătorii</li>
          <li>Nu abuzați de sistemul de mesagerie</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">4.4 Limitarea Răspunderii pentru Tranzacțiile Marketplace</h3>
        <p>TOATE TRANZACȚIILE SUNT STRICT ÎNTRE CUMPĂRĂTORI ȘI VÂNZĂTORI. Moosey declină în mod expres orice răspundere pentru litigii, pierderi, daune sau fraude rezultate din tranzacțiile marketplace. Recomandăm cu insistență întâlnirile în locuri publice și exercitarea prudenței.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">5. Planuri de Abonament și Pachete Organizatori</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.1 Planuri Gratuite și Plătite</h3>
        <p>Moosey oferă pachete gratuite și plătite pentru organizatori și furnizori de activități:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><span className="font-semibold">Plan gratuit:</span> listing de bază cu badge verificat</li>
          <li><span className="font-semibold">Plan Standard:</span> plasare featured în categorie</li>
          <li><span className="font-semibold">Plan Pro:</span> plasare featured pe homepage</li>
          <li><span className="font-semibold">Plan Premium:</span> plasare featured completă și rapoarte lunare</li>
        </ul>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.2 Facturare și Anulare</h3>
        <p>Abonamentele plătite sunt facturate lunar. Puteți anula oricând. Anularea intră în vigoare la sfârșitul perioadei de facturare curente. Nu oferim rambursări pentru luni parțiale.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">5.3 Modificări de Preț</h3>
        <p>Ne rezervăm dreptul de a modifica prețurile abonamentelor cu un preaviz de 30 de zile. Utilizarea continuă a Serviciului după modificările de preț constituie acceptarea noilor prețuri.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">6. Promoții și Concursuri</h2>
        <p>Din când în când, Moosey poate oferi promoții, concursuri sau tombole. Fiecare promoție va fi guvernată de propriile reguli specifice, care vor fi publicate pe Serviciu. Ne rezervăm dreptul de a anula sau modifica orice promoție la discreția noastră.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">7. Proprietate Intelectuală</h2>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.1 Conținutul Moosey</h3>
        <p>Denumirea Moosey, logo-ul, designul vizual, mascoța (personajul elan) și tot conținutul platformei creat de noi reprezintă proprietatea noastră intelectuală exclusivă, protejată de dreptul de autor, marcă înregistrată și alte legi aplicabile. Nu puteți utiliza, copia, reproduce sau distribui conținutul nostru fără permisiunea noastră scrisă expresă.</p>
        <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">7.2 Conținutul Dvs.</h3>
        <p>Păstrați toate drepturile asupra conținutului pe care îl creați și îl încărcați. Prin postarea conținutului pe Moosey, confirmați că aveți dreptul de a-l distribui și ne acordați licența descrisă în Secțiunea 3.1.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">8. Limitarea Răspunderii</h2>
        <p>În măsura maximă permisă de legea română și europeană:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Moosey este furnizat ca atare și conform disponibilității, fără garanții de niciun fel</li>
          <li>Nu garantăm funcționarea neîntreruptă și fără erori a Serviciului</li>
          <li>Nu suntem răspunzători pentru daune indirecte, incidentale sau consecvente</li>
          <li>Răspunderea noastră totală față de dvs. nu va depăși 100 EUR sau suma pe care ne-ați plătit-o în ultimele 12 luni, oricare este mai mare</li>
        </ul>
        <p className="mt-2">Nimic din acești Termeni nu limitează răspunderea pentru deces, vătămare corporală cauzată de neglijență sau fraudă, conform cerințelor legii române.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">9. Linkuri către Site-uri Terțe</h2>
        <p>Serviciul nostru poate conține linkuri către site-uri terțe (inclusiv organizatori de evenimente, furnizori de activități și rețele sociale). Nu avem control și nu ne asumăm nicio responsabilitate pentru conținutul sau practicile oricăror site-uri terțe. Vă recomandăm cu insistență să le consultați termenii și politicile de confidențialitate.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">10. Legea Aplicabilă și Soluționarea Litigiilor</h2>
        <p>Acești Termeni sunt guvernați de legile României, excluzând normele privind conflictele de legi. Orice litigii vor fi soluționate:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>În primul rând: prin negociere informală, contactând-ne la <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline">hello@moosey.ro</a></li>
          <li>În al doilea rând: prin mediere, dacă rezoluția informală eșuează</li>
          <li>În al treilea rând: prin instanțele române competente, în special cele din Sibiu</li>
        </ul>
        <p className="mt-2">Dacă sunteți consumator UE, puteți utiliza și platforma de Soluționare Online a Litigiilor a UE la adresa: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#ff5a2e] underline">ec.europa.eu/consumers/odr</a></p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">11. Modificări ale acestor Termeni</h2>
        <p>Ne rezervăm dreptul de a modifica acești Termeni oricând. Pentru modificări semnificative, vom furniza un preaviz de cel puțin 30 de zile prin email sau printr-un anunț prominent pe Serviciu. Utilizarea continuă a Serviciului după intrarea în vigoare a modificărilor constituie acceptarea Termenilor revizuiți.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">12. Separabilitate</h2>
        <p>Dacă vreo prevedere a acestor Termeni este considerată inaplicabilă, prevederile rămase vor continua să fie în vigoare. Prevederea inaplicabilă va fi modificată în măsura minimă necesară pentru a o face aplicabilă.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-[#ff5a2e] mt-8 mb-3">13. Contactați-ne</h2>
        <p>Pentru orice întrebări despre acești Termeni și Condiții:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Email: <a href="mailto:hello@moosey.ro" className="text-[#ff5a2e] underline font-semibold">hello@moosey.ro</a></li>
          <li>Website: www.moosey.ro</li>
        </ul>
      </section>
    </div>
  );
}

export default function TerymeniContent() {
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
          {lang === 'ro' ? 'Termeni și Condiții' : 'Terms and Conditions'}
        </h1>

        {lang === 'ro' ? <VersionRO /> : <VersionEN />}
      </main>
    </div>
  );
}
