# Moosey — CLAUDE.md

Platformă de listare a activităților pentru copii din Sibiu. Părinții descoperă locuri de joacă,
grădinițe, cursuri, spectacole și evenimente. Organizatorii pot revendica și gestiona listingurile
proprii printr-un dashboard dedicat.

---

## Status proiect (23 aprilie 2026)

### Funcționalități live ✅
- **33 listinguri** importate din Excel în Supabase
- **Upload poze** funcțional în admin cu drag & drop, reordonare și cover automat (prima poză)
- **Scraper Teatrul Gong** — `node scripts/scrape-gong.js` — rulat săptămânal manual
- **Pagina /spectacole** — calendar interactiv lunar, filtre temporale
- **Formular public /adauga-locatia-ta** — upload poze (max 5, în `pending/`), inserare cu `is_verified=false`
- **Flux aprobare admin** — `/admin/aprobare` → Aprobă (`is_verified=true`) sau Respinge (șterge)
- **Sistem revendicare end-to-end** — ClaimButton → claims DB → admin /admin/revendicari → aprobare → dashboard
- **Dashboard organizator** (`/dashboard`) — editor locație, evenimente cu poze, recenzii cu răspunsuri, statistici vizualizări
- **Multi-locație în dashboard** — selector pill buttons (`?listing=UUID`), suportă useri cu mai multe claims aprobate
- **Google OAuth + Email** — ambele văd linkul "Dashboard locație" în navbar după aprobare
- **Badge "Verificat"** — afișat strict când `is_verified = true`
- **Avatar utilizator** — poză Google sau inițială coral; upload/ștergere din /contul-meu
- **Editare nume profil** — inline în /contul-meu, salvat în auth.users + tabel profiles
- **Favorite** — grupate pe categorii în /favorite
- **Vizualizări listing** — tracked în `listing_views`, afișate în StatsPanel
- **Tabel `events`** — evenimente organizatori cu thumbnail + galerie (3 poze), start_time, end_time, price
- **Calendar organizator** în dashboard — grid lunar cu dots corale + click pe zi
- **Upload poze eveniment** — thumbnail + galerie (max 3), preview imediat, upload în `listings-images/events/`
- **Evenimente organizatori pe homepage** — combinate cu listings în secțiunea "săptămâna aceasta"
- **Evenimente organizatori în /calendar** — grupate pe zile, badge cu numele locației
- **JSON-LD structured data** pe pagina listing (LocalBusiness / ChildCare / PerformingArtsTheater)
- **Sitemap automat** `/sitemap.xml` — toate listingurile verificate + pagini statice
- **Robots.txt** — `/admin`, `/dashboard`, `/contul-meu` excluse din indexare
- **OG image generată dinamic** — `/opengraph-image` via Next.js edge runtime
- **Metadata SEO completă** — globală în layout.tsx, dinamică per pagină și per listing
- **Homepage redesignat** — hero cu pattern coral, categorii vizuale cu contor locații, featured cu rating, events cu border coral, footer complet
- **Redesign premium** — Playfair Display (font-display) + DM Sans (body), hero cu animații entrance, carduri cu hover lift (`hover:-translate-y-0.5 shadow-md`)
- **Compresie imagini client-side** — `browser-image-compression` (maxSizeMB:1, maxWidthOrHeight:1920) aplicată în toate formularele cu upload (marketplace, dashboard, adauga-locatia-ta, one-time events)
- **Marketplace second-hand** — `/marketplace` cu filtre client-side, `MarketplaceCard`, pagina detaliu `/marketplace/[id]`, formular `/marketplace/adauga`; tabele Supabase: `marketplace_listings`, `marketplace_messages`, `marketplace_favorites`; bucket Storage: `marketplace-images`
- **Mesagerie internă marketplace** — thread-uri grupate pe listing, badge mesaje necitite în navbar cu polling la 30s
- **Tab Marketplace în /contul-meu** — anunțurile mele (CRUD status), mesaje (thread expand + reply), favorite marketplace
- **Secțiune marketplace pe homepage** — 4 anunțuri recente cu badge tip (VÂND/DONEZ/ÎNCHIRIEZ)
- **Date picker în admin** — `ListingFormFields.tsx` (client component cu useState), afișează `event_date` / `start_time` / `end_time` dinamic când categoria e spectacol sau eveniment; salvat în `extractData` din `actions.ts`
- **Evenimente one-time din dashboard** — `OneTimeEventForm.tsx` + `oneTimeEventActions.ts`: inserare listing cu `is_verified=false` + flux aprobare admin existent; categorii: eveniment / spectacol / curs-atelier
- **Pagina listing redesign** — hero full-bleed cu gradient overlay, titlu suprapus, FavoriteButton pe imagine, "Alte locuri din aceeași categorie" la final
- **Pagina /despre** — povestea Moosey, misiune, categorii, marketplace section, CTA partener
- **Pagina /contact** — formular contact complet cu tabel `contact_messages` în Supabase + triggerCelebration() la succes
- **Pagini legale bilingve (EN/RO toggle)** — /politica-de-confidentialitate, /termeni-si-conditii, /gdpr — conținut din docx-uri în `docs/`
- **Footer global** — `FooterWrapper.tsx` ascunde footer pe `/admin/*` via `usePathname()`
- **Search îmbunătățit** — autocomplete cu sugestii listings + events + categorii (🏷️), sinonime extinse (KEYWORD_MAP), normalizare diacritice, highlight coral pe termenii găsiți, filtre categorii + sort (Relevanță / Top cotat / Cele mai noi), popular searches clickabile
- **Confirmare email** — reactivată în Supabase Auth cu SMTP Brevo
- **Domeniu moosey.ro** — configurat în Vercel + Cloudflare DNS

### Backlog — de făcut înainte de lansare ⏳
- [ ] `UPDATE listings SET is_verified = false WHERE claimed_by IS NULL` — toate 33 listingurile importate sunt `is_verified=true`; trebuie resetate cele fără owner
- [ ] Facebook OAuth după înregistrare firmă
- [ ] Completare date listinguri (multe au "de verificat")
- [ ] Pachete monetizare organizatori (Free/Standard/Pro/Premium)
- [ ] Newsletter Brevo conectat (formular există, backend lipsă)
- [ ] Mutare poze din `pending/` → `{listing-id}/` la aprobare (vezi secțiunea Storage)
- [ ] Email automat la aprobare claim
- [ ] Scraper Gong rulat săptămânal (`node scripts/scrape-gong.js`)
- [ ] SQL în Supabase (dacă nu s-a rulat): `ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url text; ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';`
- [ ] Schimbă `ADMIN_PASSWORD` din `admin123` în ceva puternic (min 20 caractere, litere+cifre+simboluri) în `.env.local` și în Vercel Environment Variables (`openssl rand -base64 20`)

---

## Infrastructură și domeniu

| Serviciu | Detalii |
|----------|---------|
| **Domeniu** | moosey.ro — cumpărat prin ROTLD |
| **DNS** | Cloudflare — name servers configurați în ROTLD |
| **Hosting** | Vercel — deploy automat din GitHub, domeniu moosey.ro conectat |
| **Email** | Zoho Mail — hello@moosey.ro (MX, SPF, DKIM configurați în Cloudflare) |
| **SMTP tranzacțional** | Brevo — smtp-relay.brevo.com:587, autentificat în Supabase Auth |
| **Newsletter** | Brevo — domeniu autentificat cu DKIM și DMARC în Cloudflare |
| **Repository** | GitHub — banicaradu98/kidsapp |

---

## Branding

| Element | Detalii |
|---------|---------|
| **Nume** | Moosey (redenumit din KidsApp) |
| **Logo** | `public/images/logo-moosey.png` — banner cu font retro coral |
| **Mascotă** | `public/images/moosey_transparent.png` — elan cu adidași coral |
| **Font headings** | Playfair Display (`font-display`, variabila `--font-playfair`) |
| **Font body** | DM Sans (`--font-dm-sans`) |
| **Font admin** | Nunito (nested layout `/admin/layout.tsx`) |
| **Culoare brand** | `#ff5a2e` coral (hover `#f03d12`), text dark `#1a1a2e` |
| **Animații mascotă** | confetti celebration (`MascotCelebration.tsx`), float navbar (`MascotFloat.tsx`) |

---

## Stack tehnic

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| Next.js | 14.2.35 | Framework (App Router, SSR) |
| React | 18 | UI |
| TypeScript | 5 | Tipuri |
| Tailwind CSS | 3.4.1 | Stilizare |
| Supabase | @supabase/ssr 0.10 | Bază de date + Auth |
| Playfair Display + DM Sans | Google Fonts | Tipografie globală |
| browser-image-compression | latest | Compresie imagini client-side |

---

## Variabile de mediu (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...   # anon key
SUPABASE_SERVICE_ROLE_KEY=...                       # service role — DOAR server-side
ADMIN_PASSWORD=...
NEXT_PUBLIC_SITE_URL=https://www.moosey.ro          # domeniu producție (fallback dacă lipsă)
```

- `ADMIN_PASSWORD` — parolă plaintext pentru panoul `/admin`
- `SUPABASE_SERVICE_ROLE_KEY` — folosit DOAR în `utils/supabase/admin.ts` (server-side); nu expune în browser
- `NEXT_PUBLIC_SITE_URL` — folosit în sitemap.ts, robots.ts, layout.tsx pentru URL-uri absolute OG/canonical

**Local dev:** `.env.local` setează `NEXT_PUBLIC_SITE_URL=http://localhost:3000`  
**Producție:** setează `NEXT_PUBLIC_SITE_URL=https://www.moosey.ro` în Vercel Environment Variables

---

## Pornire server

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
```

---

## Arhitectură autentificare — IMPORTANT

### Trei clienți Supabase
| Fișier | Unde se folosește | Cheie | RLS |
|--------|------------------|-------|-----|
| `utils/supabase/client.ts` | Client components (browser) | anon key | Supus RLS |
| `utils/supabase/server.ts` | Server components + API routes | anon key + JWT din cookies | Supus RLS |
| `utils/supabase/admin.ts` | Server-only: admin pages, API routes, dashboard, queries publice | service role key | **Bypass RLS** |

### Regula de aur pentru `claims`
**Nu face query la tabela `claims` din browser cu clientul anon.** JWT-ul Google OAuth nu e propagat corect în browser la momentul query-ului și poate returna rezultate greșite sau goale chiar dacă RLS e configurat corect.

| Context | Cum verifici claims |
|---------|-------------------|
| Navbar (client component) | `fetch('/api/my-claims')` → API route server-side |
| Dashboard (server component) | `adminClient` direct cu `user.id` din `getUser()` |
| Admin pages | `adminClient` direct |

### Regula pentru tabelul `events` (public read)
Tabelul `events` **nu are RLS public read** → toate query-urile de citire publică (homepage, /calendar, /listing/[id]) folosesc `adminClient`, nu `supabase` (clientul anon server).

### API route `/api/my-claims`
```
app/api/my-claims/route.ts
```
- GET handler
- `createClient(await cookies()).auth.getUser()` — identifică userul din sesiune (server-side, corect pentru Google OAuth)
- `adminClient.from("claims").select(...).eq("user_id", user.id).eq("status", "approved")`
- Returnează `{ claims: [{id, listing_id}] }`

### NavbarAuth.tsx — pattern corect
```tsx
// Initial load
supabase.auth.getSession().then(async ({ data: { session } }) => {
  setUser(session?.user ?? null);
  setReady(true);
  if (session?.user) {
    fetch("/api/my-claims")
      .then(r => r.json())
      .then(({ claims }) => setHasDashboard(claims.length > 0));
  }
});

// SIGNED_IN (OAuth redirect) — delay 500ms pentru propagare cookie
setTimeout(() => {
  fetch("/api/my-claims")
    .then(r => r.json())
    .then(({ claims }) => setHasDashboard(claims.length > 0));
}, 500);
```

### Dashboard `/dashboard/page.tsx` — pattern corect
```tsx
export const dynamic = "force-dynamic";

const supabase = createClient(await cookies());
const { data: { user } } = await supabase.auth.getUser();  // getUser(), NU getSession()
if (!user) redirect("/?login=1");

// Toate query-urile pe claims și listings folosesc adminClient
const { data: claims } = await adminClient
  .from("claims")
  .select("listing_id, listings(id, name)")
  .eq("user_id", user.id)
  .eq("status", "approved");
```

---

## Structura folderelor

```
app/
├── page.tsx                        # Homepage (SSR, featured + events săptămâna aceasta)
├── layout.tsx                      # Root layout, Playfair Display + DM Sans, metadata SEO globală
├── opengraph-image.tsx             # OG image generată dinamic (Next.js edge, 1200×630)
├── sitemap.ts                      # Sitemap automat — toate listingurile + pagini statice
├── robots.ts                       # Robots.txt — exclude /admin, /dashboard, /contul-meu
├── MobileMenu.tsx                  # Hamburger menu mobil (portal în body)
│
├── api/
│   ├── my-claims/route.ts          # GET — verifică claims aprobate pt user curent (adminClient)
│   ├── search/route.ts             # GET — autocomplete search cu rate limiting
│   ├── upload/route.ts             # POST — upload poze listing (admin + organizator)
│   ├── upload-event/route.ts       # POST — upload poze eveniment (event_id SAU listing_id pentru nou)
│   └── upload-public/route.ts      # POST — upload poze din formularul public
│
├── locuri-de-joaca/page.tsx + FilteredLocuri.tsx
├── educatie/page.tsx + FilteredEducatie.tsx
├── cursuri-ateliere/page.tsx + FilteredCursuri.tsx
├── sport/page.tsx + FilteredSport.tsx
├── spectacole/page.tsx + SpectacolCard.tsx + FilteredSpectacole.tsx
├── evenimente/page.tsx + SectionedEvenimente.tsx
├── calendar/page.tsx               # Calendar evenimente (next 2 months), combină listings + events
├── cauta/page.tsx + SearchFilters.tsx  # Search cu autocomplete, filtre, highlight, sinonime
├── gradinite/page.tsx              # Redirect permanent → /educatie
├── despre/page.tsx                 # Pagina despre Moosey (7 secțiuni, mascotă)
├── contact/page.tsx + ContactForm.tsx + contactActions.ts
├── politica-de-confidentialitate/page.tsx + PrivacyContent.tsx   # bilingv EN/RO
├── termeni-si-conditii/page.tsx + TerymeniContent.tsx             # bilingv EN/RO
├── gdpr/page.tsx + GdprContent.tsx                                # bilingv EN/RO
│
├── listing/[id]/
│   ├── page.tsx                    # Pagina detaliu listing (generateMetadata + JSON-LD)
│   ├── ListingGallery.tsx          # Hero full-bleed cu gradient overlay + title suprapus
│   ├── ClaimButton.tsx             # Buton revendicare (client, verifică status claim)
│   ├── ViewTracker.tsx             # Tracking vizualizări (client, insert la mount)
│   ├── ReviewSection.tsx           # Recenzii publice
│   └── DescriptionCollapse.tsx     # Descriere expandabilă
│
├── dashboard/
│   ├── page.tsx                    # Dashboard organizator (multi-listing, ?listing=UUID)
│   ├── ListingEditor.tsx           # Editare date locație (client, browser client)
│   ├── EventsManager.tsx           # CRUD evenimente organizator cu poze (client)
│   ├── EventCalendar.tsx           # Calendar lunar în dashboard (client, coral dots)
│   ├── eventActions.ts             # Server Actions: addEvent, updateEvent, updateEventImages, deleteEvent
│   ├── ReviewsPanel.tsx            # Recenzii + răspunsuri organizator (client)
│   └── StatsPanel.tsx              # Statistici vizualizări + rating
│
├── contul-meu/
│   ├── page.tsx                    # Profil utilizator
│   ├── ProfileCard.tsx             # Card profil cu editare nume inline (client)
│   ├── AvatarUpload.tsx            # Upload/ștergere avatar (Supabase Storage "avatars")
│   └── SignOutButton.tsx
│
├── favorite/page.tsx               # Favorite grupate pe categorii
│
├── adauga-locatia-ta/
│   ├── page.tsx
│   └── SubmitForm.tsx              # Formular public cerere listing nou
│
├── marketplace/
│   ├── page.tsx                    # Lista anunțuri cu filtre client-side
│   ├── [id]/page.tsx               # Detaliu anunț + mesagerie
│   └── adauga/page.tsx             # Formular adăugare anunț
│
├── admin/
│   ├── page.tsx                    # Dashboard admin (statistici + tabel listings)
│   ├── login/page.tsx
│   ├── nou/page.tsx
│   ├── edit/[id]/page.tsx
│   ├── aprobare/page.tsx           # Aprobare cereri publice (is_verified=false)
│   ├── revendicari/page.tsx        # Aprobare/respingere claims
│   ├── layout.tsx
│   ├── actions.ts                  # Server Actions: CRUD listings + approveClaim/rejectClaim
│   └── _components/
│       ├── AdminShell.tsx
│       ├── AdminNav.tsx
│       ├── ClaimActions.tsx
│       ├── ListingFormFields.tsx
│       ├── ImageUploader.tsx
│       └── DeleteButton.tsx
│
├── components/
│   ├── Navbar.tsx                  # Navbar shared (toate paginile non-admin)
│   ├── NavbarAuth.tsx              # Auth state în navbar (client, /api/my-claims)
│   ├── UserAvatar.tsx              # Avatar cu fallback la inițială coral
│   ├── AuthModal.tsx               # Modal login/register (Google + Email tabs)
│   ├── AutoOpenAuth.tsx            # Deschide AuthModal automat (?login=1)
│   ├── ScrollReveal.tsx            # Fade-in la scroll (IntersectionObserver, client)
│   ├── CategoryShell.tsx           # Wrapper pagini categorie
│   ├── ListingCard.tsx             # Card listing standard (cu prop highlight pentru search)
│   ├── FavoriteButton.tsx          # Buton favorit — variante: card / detail / hero
│   ├── SearchBar.tsx               # Search cu autocomplete: listings + events + categorii
│   ├── Footer.tsx                  # Footer global dark
│   ├── FooterWrapper.tsx           # Ascunde footer pe /admin/* (usePathname)
│   ├── MascotFloat.tsx             # Mascotă flotantă (bottom-right, confetti on click)
│   ├── MascotCelebration.tsx       # Overlay confetti — triggerCelebration() din orice component
│   └── EmptyState.tsx
│
public/
├── images/
│   ├── logo-moosey.png             # Logo banner retro coral
│   └── moosey_transparent.png      # Mascota elan (folosit în hero, about, celebration)
│
utils/
├── supabase/
│   ├── client.ts                   # createBrowserClient — browser, anon key
│   ├── server.ts                   # createServerClient — server, anon key + cookies
│   ├── admin.ts                    # createClient service role — BYPASS RLS, doar server
│   └── auth.ts                     # signOut helper
├── searchUtils.ts                  # normalizeText, sanitize, expandQuery, buildOrFilter, KEYWORD_MAP
├── rateLimiter.ts                  # Rate limiting pentru /api/search
├── getDynamicBadges.ts
├── getListingBadges.ts
├── reviewLevel.ts
└── dateUtils.ts                    # formatEventDate, toInputDate

scripts/
├── scrape-gong.js                  # Scraper Teatrul Gong (Node 18+, cheerio)
└── contact_messages.sql            # SQL creare tabel contact_messages

middleware.ts       # Protejează /admin/* cu cookie admin_session
docs/               # Documente legale originale (.docx)
```

---

## Tabele Supabase

### `listings`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `name` | text | Obligatoriu |
| `category` | text | Una din cele 6 valori |
| `subcategory` | text | Nullable; pentru educatie (gradinita/after-school/cresa) |
| `description` | text | Nullable |
| `address` | text | Nullable |
| `city` | text | Default: "Sibiu" |
| `price` | text | Ex: "25 lei/copil" / "Gratuit" |
| `price_details` | text | Nullable; pachete/abonamente detaliate |
| `age_min` / `age_max` | integer | Nullable |
| `schedule` | text | Nullable |
| `phone` | text | Nullable |
| `website` | text | Nullable, URL |
| `is_verified` | boolean | Default false; true = aprobat de admin sau claim aprobat |
| `is_featured` | boolean | Default false; apare pe homepage |
| `images` | text[] | URL-uri Storage; prima = cover |
| `event_date` | timestamptz | Nullable; scraper Gong; /spectacole |
| `event_end_date` | timestamptz | Nullable; pentru evenimente multi-zi |
| `start_time` | text | Nullable; format "HH:MM" |
| `end_time` | text | Nullable; format "HH:MM" |
| `contact_name` | text | Nullable; privat (din formularul public) |
| `contact_email` | text | Nullable; privat |
| `claimed_by` | uuid | Nullable; FK → auth.users.id |
| `claimed_at` | timestamptz | Nullable |
| `package` | text | Nullable; "free" la aprobare claim |
| `created_at` | timestamptz | Auto |
| `updated_at` | timestamptz | Auto (folosit în sitemap lastModified) |

### `claims`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → listings.id |
| `user_id` | uuid | FK → auth.users.id |
| `email` | text | NOT NULL |
| `phone` | text | Nullable |
| `message` | text | Nullable |
| `status` | text | 'pending' / 'approved' / 'rejected' |
| `created_at` | timestamptz | Auto |

RLS: SELECT + INSERT pentru `auth.uid() = user_id`  
**ATENȚIE**: Chiar dacă RLS e corect, NU interoga claims din browser cu clientul anon pentru Google OAuth — folosește `/api/my-claims`.

### `events` ← tabelul principal pentru evenimente organizatori
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → listings.id |
| `user_id` | uuid | FK → auth.users.id |
| `title` | text | Obligatoriu |
| `description` | text | Nullable |
| `event_date` | timestamptz | Obligatoriu; stocat UTC; afișat cu `getUTCDate/Month` |
| `start_time` | text | Nullable; format "HH:MM" |
| `end_time` | text | Nullable; format "HH:MM" |
| `price` | numeric | Nullable; în lei |
| `thumbnail_url` | text | Nullable; URL Storage `listings-images/events/...` |
| `gallery_urls` | text[] | Default `{}`; max 3 URL-uri |
| `created_at` | timestamptz | Auto |

**SQL pentru coloane noi (rulează în Supabase dacă nu s-a rulat):**
```sql
ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';
```

**RLS**: Tabelul events nu are public read policy → toate query-urile publice folosesc `adminClient`.

### `marketplace_listings`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users.id |
| `title` | text | |
| `description` | text | Nullable |
| `price` | numeric | Nullable |
| `type` | text | 'vand' / 'donez' / 'inchiriez' |
| `category` | text | Nullable |
| `images` | text[] | URL-uri Storage bucket `marketplace-images` |
| `status` | text | 'activ' / 'vandut' / 'rezervat' |
| `created_at` | timestamptz | Auto |

### `marketplace_messages`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → marketplace_listings.id |
| `sender_id` | uuid | FK → auth.users.id |
| `receiver_id` | uuid | FK → auth.users.id |
| `text` | text | |
| `is_read` | boolean | Default false |
| `created_at` | timestamptz | Auto |

### `marketplace_favorites`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `user_id` | uuid | FK → auth.users.id |
| `listing_id` | uuid | FK → marketplace_listings.id |
| `created_at` | timestamptz | Auto |

### `contact_messages`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `name` | text | NOT NULL |
| `email` | text | NOT NULL |
| `subject` | text | NOT NULL |
| `message` | text | NOT NULL |
| `created_at` | timestamptz | Auto |

RLS: INSERT public (oricine poate trimite). SELECT doar via adminClient (service role).  
**SQL:** `scripts/contact_messages.sql`

### `organizer_events` — DEPRECAT
Tabelul vechi, nefolosit. Înlocuit complet de `events`.

### `listing_views`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → listings.id |
| `user_id` | uuid | Nullable (vizitatori anonimi) |
| `viewed_at` | timestamptz | Auto |

### `review_replies`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `review_id` | uuid | FK → reviews.id |
| `text` | text | |
| `created_at` | timestamptz | Auto |

### `reviews`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → listings.id |
| `user_id` | uuid | FK → auth.users.id |
| `user_name` | text | |
| `rating` | integer | 1-5 |
| `text` | text | Nullable |
| `created_at` | timestamptz | Auto |

---

## SEO

### Fișiere SEO
| Fișier | Rol |
|--------|-----|
| `app/layout.tsx` | Metadata globală: title template, description, OG, Twitter card, robots |
| `app/opengraph-image.tsx` | OG image generată dinamic (Next.js edge, 1200×630px) |
| `app/sitemap.ts` | `/sitemap.xml` — homepage, categorii, toate listingurile din DB |
| `app/robots.ts` | `/robots.txt` — Allow `/`, Disallow `/admin`, `/dashboard`, `/contul-meu`, `/api` |

### Pattern metadata per pagină
```tsx
// Pagini statice (categorii, calendar etc.)
export const metadata = {
  title: "Titlu pagină",           // → template → "Titlu pagină — Moosey"
  description: "...",
  alternates: { canonical: "/url-relativ" },
  openGraph: { title: "...", description: "...", url: "/url-relativ" },
};

// Pagini dinamice (listing/[id])
export async function generateMetadata({ params }): Promise<Metadata> {
  // fetch listing → return metadata cu OG image din images[0]
}
```

### JSON-LD pe pagina listing
Schema tip: `LocalBusiness` / `ChildCare` (educatie) / `PerformingArtsTheater` (spectacol)  
Câmpuri: `name`, `description`, `address`, `telephone`, `url`, `image`, `priceRange`, `aggregateRating`

### Title template
`layout.tsx` setează `title.template = "%s — Moosey"`. Paginile setează doar `title: "Titlu local"` fără sufix.

---

## Admin panel

- **URL:** `/admin` → redirect la `/admin/login` dacă nu ești autentificat
- **Auth:** cookie httpOnly `admin_session` = `ADMIN_PASSWORD` (7 zile)
- **Middleware:** protejează `/admin/*` exceptând `/admin/login`
- **Toate query-urile** pe `claims` în admin folosesc `adminClient` — cookie-ul `admin_session` nu e JWT Supabase, deci `auth.uid()` = null și RLS ar bloca totul cu clientul normal
- **`approveClaim`** în `actions.ts`: setează `status='approved'` pe claim + `claimed_by`, `claimed_at`, `is_verified=true`, `package='free'` pe listing + `revalidatePath` (fără `redirect`)
- **`ClaimActions.tsx`** (client component): `router.refresh()` după acțiune pentru refresh fără redirect

---

## Categorii

| Valoare DB | Emoji | Label | URL |
|------------|-------|-------|-----|
| `loc-de-joaca` | 🛝 | Loc de joacă | `/locuri-de-joaca` |
| `educatie` | 🎓 | Educație | `/educatie` |
| `curs-atelier` | 🎨 | Curs & Atelier | `/cursuri-ateliere` |
| `sport` | ⚽ | Sport | `/sport` |
| `spectacol` | 🎭 | Spectacol | `/spectacole` |
| `eveniment` | 🎪 | Eveniment | `/evenimente` |

`CATEGORY_META` e definit în `ListingCard.tsx` (sursă primară), copiat în `listing/[id]/page.tsx`. Dacă adaugi categorie nouă → actualizează toate locurile + `tailwind.config.ts` safelist.

---

## Convenții design

- **Brand coral:** `#ff5a2e` (hover `#f03d12`), **text dark:** `#1a1a2e`
- **Fonturi:** Playfair Display pentru `font-display` (headings premium), DM Sans pentru body
- Carduri: `rounded-2xl` / `rounded-3xl`, shadow subtile, `hover:-translate-y-0.5`
- Header sticky: `sticky top-0 z-50 bg-white border-b border-[#f0f0f0]`
- Grid listings: `flex-col gap-4 sm:grid sm:grid-cols-2`
- Homepage: pattern coral dots în hero, categorii 2 col mobile / 3 col desktop, ScrollReveal pe secțiuni

---

## Date — convenții critice

### `event_date` este `timestamptz` (UTC)
**Afișare corectă** — folosește ÎNTOTDEAUNA metode UTC:
```ts
const d = new Date(ev.event_date);
d.getUTCDate()       // ziua corectă
d.getUTCMonth()      // luna corectă
d.toLocaleDateString("ro-RO", { timeZone: "UTC", ... })
```
**Nu** folosi `d.getDate()` sau `d.getMonth()` fără `timeZone: "UTC"` — poate returna ziua anterioară pentru România (UTC+2/3).

### `toInputDate()` helper — pentru `<input type="date">`
```ts
function toInputDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,"0")}-${String(d.getUTCDate()).padStart(2,"0")}`;
}
```

---

## Search — arhitectură

| Fișier | Rol |
|--------|-----|
| `app/components/SearchBar.tsx` | Autocomplete client: listings + events (API) + categorii (client-side) |
| `app/api/search/route.ts` | GET — rate limited (60 req/min/IP), expandQuery + buildOrFilter |
| `utils/searchUtils.ts` | `normalizeText`, `sanitize`, `expandQuery`, `buildOrFilter`, `KEYWORD_MAP` |
| `utils/rateLimiter.ts` | In-memory rate limiter pentru /api/search |
| `app/cauta/page.tsx` | Pagina rezultate: highlight, filtre, sort, popular searches |
| `app/cauta/SearchFilters.tsx` | Pills categorii + sort (Relevanță / Top cotat / Cele mai noi) |

**KEYWORD_MAP** în `searchUtils.ts` acoperă: teatru, spectacol, joaca, piscina, inot, fotbal, dans, balet, robotica, programare, stem, gradinita, cresa, afterschool, karate, engleza, germana, franceza, pictura, muzica, tenis, gimnastica, yoga, sah, papusi și variantele lor cu/fără diacritice.

---

## Probleme cunoscute și soluții permanente

### Admin panel nestyled după restart
- `app/admin/layout.tsx` importă explicit `../globals.css` + font Nunito în `<div>` wrapper (nu are `<html>`/`<body>` propriu — e nested layout)
- `tailwind.config.ts` are `safelist` cu clasele dinamice din `CATEGORY_META`
- Fix: `rm -rf .next && npm run dev`

### Clase Tailwind dinamice
Clasele din `CATEGORY_META` (gradiente, tagColor) trebuie adăugate manual în `safelist` din `tailwind.config.ts` — JIT nu le detectează static.

### Storage poze — flux pending → aprobare
- Poze din `/adauga-locatia-ta` → `listings-images/pending/{timestamp}-{random}.ext`
- La aprobare ar trebui mutate în `listings-images/{listing-id}/` — **neimplementat**
- Până atunci rămân în `pending/` și funcționează, dar se acumulează

### Poze eveniment — bucket policy
- Bucketul `listings-images` trebuie să aibă policy publică SELECT pentru ca imaginile să fie vizibile
- Dacă imaginile uploadate returnează 403: `CREATE POLICY "Public read listings-images" ON storage.objects FOR SELECT USING (bucket_id = 'listings-images');`

---

## Auth — note generale

- Email confirmation: **activată** în producție cu SMTP Brevo
- Google OAuth: Client ID `129695324744-hegk6rklfmt3452uet9q7j1udotd3gmr.apps.googleusercontent.com`
- Google OAuth callback URL: `http://localhost:3000/auth/callback` (dev) + `https://www.moosey.ro/auth/callback` (prod)
- `createClient` din `server.ts` necesită `cookieStore`: `createClient(await cookies())`
- `is_featured` → secțiunea "Recomandate" pe homepage (max 6)
- Tabel `profiles` cu trigger automat la înregistrare user nou

---

## Update-uri recente (Aprilie 2026)

### Sistem pachete (pregătit, neactivat public)
- `utils/packages.ts` — configurație completă Free/Standard/Pro
- Coloana `profiles.package` și `profiles.package_expires_at` (rulează SQL dacă nu există)
- `hasFeature()` utility pentru verificare permisiuni per tier
- Dashboard statistici: graficul 30 zile vizibil doar Standard/Pro; Free vede banner discret
- Prețuri: Free=0, Standard=50lei/lună sau 500lei/an, Pro=100lei/lună sau 1000lei/an

**SQL pentru coloane noi (rulează în Supabase SQL Editor dacă nu s-a rulat):**
```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS package TEXT DEFAULT 'free'
CHECK (package IN ('free', 'standard', 'pro'));

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS package_expires_at TIMESTAMPTZ;
```

### Flux adăugare locație publică
- Formularul `/adauga-locatia-ta` salvează cu `is_verified=false`
- Email confirmare trimis organizatorului via Brevo
- Email notificare trimis la hello@moosey.ro la fiecare submit
- La aprobare din admin: email automat organizator + notificare admin
- API route: `/api/approve-listing` și `/api/send-confirmation`

### Alte fix-uri recente
- Badge "Verificat" ascuns temporar (reimplementat în pachetul Standard)
- Filtrare `is_verified=true` pe toate paginile publice
- Calendar homepage: fetch 90 zile, filtrare client-side corectă
- Evenimente multi-zi apar pe toate săptămânile din interval
- Validare obligatorie `event_date` pentru spectacole/evenimente în admin
- Emoji support în TipTap editor și RichTextDisplay
- CSP headers actualizate pentru Google Analytics
- Canonical URLs pe toate paginile pentru SEO
- Sitemap complet cu toate rutele
