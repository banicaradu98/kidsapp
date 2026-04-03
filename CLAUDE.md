# KidsApp Sibiu — CLAUDE.md

Platformă de listare a activităților pentru copii din Sibiu. Părinții descoperă locuri de joacă,
grădinițe, cursuri, spectacole și evenimente. Organizatorii pot revendica și gestiona listingurile
proprii printr-un dashboard dedicat.

---

## Status proiect (3 aprilie 2026)

### Funcționalități live ✅
- **33 listinguri** importate din Excel în Supabase
- **Upload poze** funcțional în admin cu drag & drop, reordonare și cover automat (prima poză)
- **Scraper Teatrul Gong** — `node scripts/scrape-gong.js` — rulat săptămânal manual
- **Pagina /spectacole** — calendar interactiv lunar, filtre temporale
- **Formular public /adauga-locatia-ta** — upload poze (max 5, în `pending/`), inserare cu `is_verified=false`
- **Flux aprobare admin** — `/admin/aprobare` → Aprobă (`is_verified=true`) sau Respinge (șterge)
- **Sistem revendicare end-to-end** — ClaimButton → claims DB → admin /admin/revendicari → aprobare → dashboard
- **Dashboard organizator** (`/dashboard`) — editor locație, evenimente, recenzii cu răspunsuri, statistici vizualizări
- **Multi-locație în dashboard** — selector pill buttons (`?listing=UUID`), suportă useri cu mai multe claims aprobate
- **Google OAuth + Email** — ambele văd linkul "Dashboard locație" în navbar după aprobare
- **Badge "Verificat"** — afișat strict când `is_verified = true`
- **Avatar utilizator** — poză Google sau inițială coral; upload/ștergere din /contul-meu
- **Favorite** — grupate pe categorii în /favorite
- **Vizualizări listing** — tracked în `listing_views`, afișate în StatsPanel

### Backlog — de făcut ⏳
- [ ] `UPDATE listings SET is_verified = false WHERE claimed_by IS NULL` — toate 33 listingurile importate sunt `is_verified=true`; trebuie resetate cele fără owner
- [ ] Email automat la aprobare claim
- [ ] Calendar vizual evenimente în dashboard owner
- [ ] Buton revendicare vizibil pe mobile
- [ ] Mutare poze din `pending/` → `{listing-id}/` la aprobare (vezi secțiunea Storage)

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
```

- `ADMIN_PASSWORD` — parolă plaintext pentru panoul `/admin`
- `SUPABASE_SERVICE_ROLE_KEY` — folosit DOAR în `utils/supabase/admin.ts` (server-side); nu expune în browser

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
| `utils/supabase/admin.ts` | Server-only: admin pages, API routes, dashboard | service role key | **Bypass RLS** |

### Regula de aur pentru `claims`
**Nu face query la tabela `claims` din browser cu clientul anon.** JWT-ul Google OAuth nu e propagat corect în browser la momentul query-ului și poate returna rezultate greșite sau goale chiar dacă RLS e configurat corect.

| Context | Cum verifici claims |
|---------|-------------------|
| Navbar (client component) | `fetch('/api/my-claims')` → API route server-side |
| Dashboard (server component) | `adminClient` direct cu `user.id` din `getUser()` |
| Admin pages | `adminClient` direct |

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
├── layout.tsx                      # Root layout, font Nunito
├── MobileMenu.tsx                  # Hamburger menu mobil (portal în body)
│
├── api/
│   └── my-claims/route.ts          # GET — verifică claims aprobate pt user curent (adminClient)
│
├── locuri-de-joaca/page.tsx + FilteredLocuri.tsx
├── educatie/page.tsx + FilteredEducatie.tsx
├── cursuri-ateliere/page.tsx + FilteredCursuri.tsx
├── sport/page.tsx + FilteredSport.tsx
├── spectacole/page.tsx + SpectacolCard.tsx + FilteredSpectacole.tsx
├── evenimente/page.tsx + SectionedEvenimente.tsx
├── calendar/page.tsx               # Calendar evenimente (next 2 months)
├── gradinite/page.tsx              # Redirect permanent → /educatie
│
├── listing/[id]/
│   ├── page.tsx                    # Pagina detaliu listing
│   ├── ClaimButton.tsx             # Buton revendicare (client, verifică status claim)
│   ├── ViewTracker.tsx             # Tracking vizualizări (client, insert la mount)
│   ├── ListingGallery.tsx          # Galerie poze
│   ├── ReviewSection.tsx           # Recenzii publice
│   └── DescriptionCollapse.tsx     # Descriere expandabilă
│
├── dashboard/
│   ├── page.tsx                    # Dashboard organizator (multi-listing, ?listing=UUID)
│   ├── ListingEditor.tsx           # Editare date locație (client, browser client)
│   ├── EventsManager.tsx           # CRUD evenimente organizator (client)
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
│   ├── revendicari/page.tsx        # Aprobare/respingere claims organizatori
│   ├── layout.tsx
│   ├── actions.ts                  # Server Actions: CRUD listings + approveClaim/rejectClaim
│   └── _components/
│       ├── AdminShell.tsx          # Layout cu sidebar (badge pending claims)
│       ├── AdminNav.tsx            # Nav sidebar cu badge numeric
│       ├── ListingFormFields.tsx
│       ├── ImageUploader.tsx
│       └── DeleteButton.tsx
│
├── components/
│   ├── Navbar.tsx                  # Navbar shared (toate paginile non-admin)
│   ├── NavbarAuth.tsx              # Auth state în navbar (client component)
│   ├── UserAvatar.tsx              # Avatar cu fallback la inițială coral
│   ├── AuthModal.tsx               # Modal login/register
│   ├── AutoOpenAuth.tsx            # Deschide AuthModal automat (?login=1)
│   ├── CategoryShell.tsx           # Wrapper pagini categorie
│   ├── ListingCard.tsx             # Card listing standard
│   ├── FavoriteButton.tsx          # Buton favorit (client)
│   └── EmptyState.tsx
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

### `organizer_events`
| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK |
| `listing_id` | uuid | FK → listings.id |
| `title` | text | |
| `description` | text | Nullable |
| `event_date` | timestamptz | |
| `price` | text | Nullable |
| `created_at` | timestamptz | Auto |

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

## Admin panel

- **URL:** `/admin` → redirect la `/admin/login` dacă nu ești autentificat
- **Auth:** cookie httpOnly `admin_session` = `ADMIN_PASSWORD` (7 zile)
- **Middleware:** protejează `/admin/*` exceptând `/admin/login`
- **Toate query-urile** pe `claims` în admin folosesc `adminClient` — cookie-ul `admin_session` nu e JWT Supabase, deci `auth.uid()` = null și RLS ar bloca totul cu clientul normal
- **`approveClaim`** în `actions.ts`: setează `status='approved'` pe claim + `claimed_by`, `claimed_at`, `is_verified=true`, `package='free'` pe listing + `revalidatePath` înainte de `redirect`

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

---

## Auth — note generale

- Email confirmation: **dezactivat** în dev — reactivează înainte de producție (Supabase → Auth → Settings)
- Google OAuth callback URL: `http://localhost:3000/auth/callback` (dev) + domeniu producție
- `createClient` din `server.ts` necesită `cookieStore`: `createClient(await cookies())`
- `is_featured` → secțiunea "Recomandate" pe homepage (max 6)
