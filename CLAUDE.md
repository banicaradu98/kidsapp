# KidsApp Sibiu — CLAUDE.md

Platformă de listare a activităților pentru copii din Sibiu. Părinții descoperă locuri de joacă,
grădinițe, cursuri, spectacole și evenimente. Organizatorii pot revendica și gestiona listingurile
proprii printr-un dashboard dedicat.

---

## Status proiect (6 aprilie 2026)

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

### Backlog — de făcut înainte de lansare ⏳
- [ ] `UPDATE listings SET is_verified = false WHERE claimed_by IS NULL` — toate 33 listingurile importate sunt `is_verified=true`; trebuie resetate cele fără owner
- [ ] Reactivare confirmare email în Supabase + configurare SMTP Brevo
- [ ] Facebook OAuth după înregistrare firmă
- [ ] Domeniu propriu → setează `NEXT_PUBLIC_SITE_URL` în `.env.local` și în producție
- [ ] Logo + rebranding + actualizare OG image și metadata SEO
- [ ] Completare date listinguri (multe au "de verificat")
- [ ] Pagina /despre
- [ ] Pachete monetizare organizatori (Free/Standard/Pro/Premium)
- [ ] Newsletter Brevo conectat (formular există, backend lipsă)
- [ ] Mutare poze din `pending/` → `{listing-id}/` la aprobare (vezi secțiunea Storage)
- [ ] Email automat la aprobare claim
- [ ] Scraper Gong rulat săptămânal (`node scripts/scrape-gong.js`)
- [ ] SQL în Supabase (dacă nu s-a rulat): `ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url text; ALTER TABLE events ADD COLUMN IF NOT EXISTS gallery_urls text[] DEFAULT '{}';`

---

## Stack tehnic

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| Next.js | 14.2.35 | Framework (App Router, SSR) |
| React | 18 | UI |
| TypeScript | 5 | Tipuri |
| Tailwind CSS | 3.4.1 | Stilizare |
| Supabase | @supabase/ssr 0.10 | Bază de date + Auth |
| Font | Nunito (Google Fonts) | Tipografie globală |

---

## Variabile de mediu (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...   # anon key
SUPABASE_SERVICE_ROLE_KEY=...                       # service role — DOAR server-side
ADMIN_PASSWORD=...
NEXT_PUBLIC_SITE_URL=https://kidsapp.ro             # domeniu producție (fallback dacă lipsă)
```

- `ADMIN_PASSWORD` — parolă plaintext pentru panoul `/admin`
- `SUPABASE_SERVICE_ROLE_KEY` — folosit DOAR în `utils/supabase/admin.ts` (server-side); nu expune în browser
- `NEXT_PUBLIC_SITE_URL` — folosit în sitemap.ts, robots.ts, layout.tsx pentru URL-uri absolute OG/canonical

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
├── page.tsx                        # Homepage redesignat (SSR, featured + events săptămâna aceasta)
├── page.tsx.backup                 # Backup homepage înainte de redesign (6 apr 2026)
├── layout.tsx                      # Root layout, font Nunito, metadata SEO globală
├── opengraph-image.tsx             # OG image generată dinamic (Next.js edge, 1200×630)
├── sitemap.ts                      # Sitemap automat — toate listingurile + pagini statice
├── robots.ts                       # Robots.txt — exclude /admin, /dashboard, /contul-meu
├── MobileMenu.tsx                  # Hamburger menu mobil (portal în body)
│
├── api/
│   ├── my-claims/route.ts          # GET — verifică claims aprobate pt user curent (adminClient)
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
├── gradinite/page.tsx              # Redirect permanent → /educatie
│
├── listing/[id]/
│   ├── page.tsx                    # Pagina detaliu listing (generateMetadata + JSON-LD)
│   ├── ClaimButton.tsx             # Buton revendicare (client, verifică status claim)
│   ├── ViewTracker.tsx             # Tracking vizualizări (client, insert la mount)
│   ├── ListingGallery.tsx          # Galerie poze
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
│   ├── AvatarUpload.tsx            # Upload/ștergere avatar (Supabase Storage "avatars")
│   └── SignOutButton.tsx
│
├── favorite/page.tsx               # Favorite grupate pe categorii
│
├── adauga-locatia-ta/
│   ├── page.tsx
│   └── SubmitForm.tsx              # Formular public cerere listing nou
│
├── admin/
│   ├── page.tsx                    # Dashboard admin (statistici + tabel listings)
│   ├── login/page.tsx
│   ├── nou/page.tsx
│   ├── edit/[id]/page.tsx
│   ├── aprobare/page.tsx           # Aprobare cereri publice (is_verified=false)
│   ├── revendicari/page.tsx        # Aprobare/respingere claims (force-dynamic, ClaimActions client)
│   ├── layout.tsx
│   ├── actions.ts                  # Server Actions: CRUD listings + approveClaim/rejectClaim
│   └── _components/
│       ├── AdminShell.tsx          # Layout cu sidebar (badge pending claims)
│       ├── AdminNav.tsx            # Nav sidebar cu badge numeric
│       ├── ClaimActions.tsx        # Butoane aprobare/respingere (client, router.refresh())
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
│   ├── ListingCard.tsx             # Card listing standard
│   ├── FavoriteButton.tsx          # Buton favorit (client)
│   └── EmptyState.tsx
│
public/                             # Director creat (6 apr); adaugă og-image.png manual dacă vrei fallback static
│
utils/supabase/
├── client.ts       # createBrowserClient — browser, anon key
├── server.ts       # createServerClient — server, anon key + cookies
├── admin.ts        # createClient service role — BYPASS RLS, doar server
└── auth.ts         # signOut helper

middleware.ts       # Protejează /admin/* cu cookie admin_session
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

**Upload poze eveniment** — două fluxuri în `/api/upload-event`:
- Eveniment **nou** (no event_id yet): trimite `listing_id`, path = `events/{listingId}/{timestamp}-thumbnail.ext`
- Eveniment **existent** (editare): trimite `event_id`, path = `events/{eventId}/thumbnail.ext`

**Flux adăugare eveniment nou cu poze** (în EventsManager):
1. Uploadează thumbnail → obține URL
2. Uploadează galerie → obține URL-uri
3. `addEvent({...payload, thumbnail_url, gallery_urls})` → INSERT cu URL-urile deja setate

### `organizer_events` — DEPRECAT
Tabelul vechi, nefolosit. Înlocuit complet de `events`. Paginile care interogau `organizer_events` au fost migrate la `events`.

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
  title: "Titlu pagină",           // → template → "Titlu pagină — KidsApp Sibiu"
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
`layout.tsx` setează `title.template = "%s — KidsApp Sibiu"`. Paginile setează doar `title: "Titlu local"` fără sufix.

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

`CATEGORY_META` e definit în `ListingCard.tsx` (sursă primară), copiat în `page.tsx` și `listing/[id]/page.tsx`. Dacă adaugi categorie nouă → actualizează toate 3 + `tailwind.config.ts` safelist.

---

## Convenții design

- **Brand coral:** `#ff5a2e` (hover `#f03d12`), **text dark:** `#1a1a2e`
- Font: **Nunito** — titluri `font-black`, subtitluri `font-bold`/`font-semibold`
- Carduri: `rounded-2xl` / `rounded-3xl`, shadow subtile
- Header sticky: `sticky top-0 z-50 bg-white/95 backdrop-blur`
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

- Email confirmation: **dezactivat** în dev — reactivează înainte de producție (Supabase → Auth → Settings)
- Google OAuth: Client ID `129695324744-hegk6rklfmt3452uet9q7j1udotd3gmr.apps.googleusercontent.com`
- Google OAuth callback URL: `http://localhost:3000/auth/callback` (dev) + domeniu producție
- `createClient` din `server.ts` necesită `cookieStore`: `createClient(await cookies())`
- `is_featured` → secțiunea "Recomandate" pe homepage (max 6)
- Tabel `profiles` cu trigger automat la înregistrare user nou
