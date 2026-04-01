# KidsApp Sibiu — CLAUDE.md

Platformă de listare a activităților pentru copii din Sibiu. Părinții descoperă locuri de joacă, grădinițe, cursuri, spectacole și evenimente. Conținutul e gestionat de un admin panel simplu protejat cu parolă.

---

## Status proiect (2 aprilie 2026)

- **33 listinguri** importate din Excel în Supabase
- **Upload poze** funcțional în admin cu drag & drop, reordonare și cover automat (prima poză)
- **Scraper Teatrul Gong** funcțional — `node scripts/scrape-gong.js` — rulat săptămânal manual; inserează 22 spectacole cu `event_date`, imagine cover și preț
- **Pagina /spectacole** — calendar interactiv lunar, filtre temporale (săptămâna / luna / urmează / toate), badge locație, carduri cu dată/oră proeminentă
- **Formular public /adauga-locatia-ta** — organizatorii pot trimite cereri fără cont; upload poze (max 5, în `pending/`); inserare cu `is_verified=false`
- **Flux aprobare** — cerere publică → `is_verified=false` → admin `/admin/aprobare` → Aprobă (`is_verified=true`) sau Respinge (șterge); banner alert în dashboard când există cereri
- **Hartă Google Maps embed** pe pagina de detaliu listing (`/listing/[id]`) — iframe fără API key
- **6 categorii finale** cu filtre subcategorii funcționale (sport, cursuri-ateliere, educație)
- **RLS Supabase** activ — SELECT deschis pentru anon; INSERT/UPDATE/DELETE folosesc `adminClient` cu `SUPABASE_SERVICE_ROLE_KEY` (bypass RLS)

---

## Stack tehnic

| Tehnologie | Versiune | Rol |
|------------|----------|-----|
| Next.js | 14.2.35 | Framework (App Router, SSR) |
| React | 18 | UI |
| TypeScript | 5 | Tipuri |
| Tailwind CSS | 3.4.1 | Stilizare |
| Supabase | @supabase/ssr 0.10 | Bază de date + auth cookies |
| Font | Nunito (Google Fonts) | Tipografie globală |

---

## Variabile de mediu (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
ADMIN_PASSWORD=...
```

- `ADMIN_PASSWORD` — parolă plaintext pentru panoul admin (comparată direct, fără hashing)
- Supabase folosește cheia publishable (anon key), nu service role

---

## Pornire server

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npm run lint
```

---

## Structura folderelor

```
app/
├── page.tsx                        # Homepage (SSR, featured listings)
├── layout.tsx                      # Root layout, font Nunito, metadata globală
├── MobileMenu.tsx                  # Hamburger menu mobil (portal în body)
├── not-found.tsx                   # Pagina 404
│
├── locuri-de-joaca/
│   ├── page.tsx                    # category = 'loc-de-joaca'
│   └── FilteredLocuri.tsx          # Filtru: spațiu (indoor/outdoor) + preț
│
├── educatie/
│   ├── page.tsx                    # category = 'educatie'
│   └── FilteredEducatie.tsx        # Filtru: subcategory (gradinita/after-school/cresa)
│
├── cursuri-ateliere/
│   ├── page.tsx                    # category = 'curs-atelier'
│   └── FilteredCursuri.tsx         # Filtru: preț
│
├── sport/
│   └── page.tsx                    # category = 'sport'
│
├── spectacole/
│   └── page.tsx                    # category = 'spectacol'
│
├── evenimente/
│   ├── page.tsx                    # category = 'eveniment', sortat cronologic
│   └── SectionedEvenimente.tsx     # Secțiuni: Această săptămână / Luna aceasta / Urmează
│
├── listing/[id]/
│   ├── page.tsx                    # Pagina de detaliu listing (select *)
│   └── DescriptionCollapse.tsx     # Descriere expandabilă
│
├── gradinite/
│   └── page.tsx                    # Redirect permanent → /educatie
│
├── admin/
│   ├── page.tsx                    # Dashboard: statistici + tabel toate listingurile
│   ├── login/page.tsx              # Formular login cu parolă
│   ├── nou/page.tsx                # Creare listing nou
│   ├── edit/[id]/page.tsx          # Editare listing existent
│   ├── layout.tsx                  # Layout admin
│   ├── actions.ts                  # Server actions: login/logout/create/update/delete
│   └── _components/
│       ├── ListingFormFields.tsx   # Formular reutilizat în nou + edit
│       ├── AdminNav.tsx            # Sidebar navigare admin
│       ├── AdminShell.tsx          # Wrapper layout admin
│       └── DeleteButton.tsx        # Buton ștergere cu confirmare
│
├── components/
│   ├── CategoryShell.tsx           # Wrapper standard pentru paginile de categorie
│   ├── ListingCard.tsx             # Card orizontal listing (export: Listing, CATEGORY_META, formatAge)
│   └── EmptyState.tsx              # Placeholder când nu există rezultate
│
utils/
└── supabase/
    ├── client.ts                   # createBrowserClient (client components)
    ├── server.ts                   # createServerClient (server components, ia cookieStore)
    └── middleware.ts               # createServerClient (middleware)

middleware.ts                       # Protejează /admin/* (verifică cookie admin_session)
```

---

## Cele 6 categorii finale

| Valoare DB | Emoji | Label | URL | Note |
|------------|-------|-------|-----|------|
| `loc-de-joaca` | 🛝 | Loc de joacă | `/locuri-de-joaca` | |
| `educatie` | 🎓 | Educație | `/educatie` | Are coloana `subcategory` (gradinita / after-school / cresa) |
| `curs-atelier` | 🎨 | Curs & Atelier | `/cursuri-ateliere` | Fostele: curs, atelier, limbi-straine |
| `sport` | ⚽ | Sport | `/sport` | |
| `spectacol` | 🎭 | Spectacol | `/spectacole` | |
| `eveniment` | 🎪 | Eveniment | `/evenimente` | |

Toate metadatele de afișare (emoji, culori Tailwind, gradiente) sunt definite în `CATEGORY_META` din:
- `app/components/ListingCard.tsx` — sursă primară, exportată
- `app/page.tsx` — copie locală pentru homepage
- `app/listing/[id]/page.tsx` — copie locală pentru pagina de detaliu

**Important:** dacă adaugi o categorie nouă, actualizează toate cele 3 locuri.

---

## Tabelul `listings` în Supabase

| Coloană | Tip | Note |
|---------|-----|------|
| `id` | uuid | PK, generat automat |
| `name` | text | Obligatoriu |
| `category` | text | Una din cele 6 valori de mai sus |
| `subcategory` | text | Nullable; folosit pentru `educatie` (gradinita / after-school / cresa) |
| `description` | text | Nullable |
| `address` | text | Nullable |
| `city` | text | Default: "Sibiu" |
| `price` | text | Ex: "25 lei/copil" sau "Gratuit" |
| `price_details` | text | Nullable; text lung cu pachete/abonamente — afișat în secțiunea "Prețuri" pe pagina de detaliu |
| `age_min` | integer | Nullable |
| `age_max` | integer | Nullable |
| `schedule` | text | Ex: "Luni–Vineri 10:00–20:00" |
| `phone` | text | Nullable |
| `website` | text | Nullable, URL |
| `is_verified` | boolean | Default false; cereri publice intră cu false, admin aprobă |
| `is_featured` | boolean | Default false; apare pe homepage |
| `images` | text[] | Array URL-uri Supabase Storage; prima = cover |
| `event_date` | timestamptz | Nullable; populat de scraper Gong; folosit pe /spectacole |
| `contact_name` | text | Nullable; privat — persoana de contact din formularul public |
| `contact_email` | text | Nullable; privat — email contact, nu se afișează public |
| `created_at` | timestamptz | Generat automat |

Prețul "gratuit" este detectat prin `price.toLowerCase() === "gratuit"` (afișat verde).

---

## Admin panel

- **URL:** `/admin` (redirect automat la `/admin/login` dacă nu ești autentificat)
- **Auth:** parolă simplă din `ADMIN_PASSWORD` env var, stocată în cookie httpOnly `admin_session` (7 zile)
- **Middleware:** `middleware.ts` protejează toate rutele `/admin/*` exceptând `/admin/login`
- **Acțiuni:** Server Actions în `app/admin/actions.ts` — `createListing`, `updateListing`, `deleteListing`, `loginAction`, `logoutAction`
- **Formular:** `ListingFormFields.tsx` este reutilizat atât la creare cât și la editare

---

## Convenții de design

### Culori
- **Coral / brand:** `#ff5a2e` (hover: `#f03d12`)
- **Text dark:** `#1a1a2e`
- **Fundal:** `bg-white` / `bg-gray-50`
- **Accent pe categorii:** orange (joacă), green (educație), purple (cursuri), sky (sport), rose (spectacole), pink (evenimente)

### Tipografie
- Font: **Nunito** din Google Fonts (definit în `app/layout.tsx`)
- Titluri: `font-black`
- Subtitluri / labels: `font-bold` sau `font-semibold`

### Layout
- **Mobile-first** — breakpoint principal `sm:` și `md:`
- Max-width conținut: `max-w-6xl` (homepage) / `max-w-4xl` (pagini categorie)
- Grid categorii homepage: `grid-cols-3 lg:grid-cols-6`
- Grid listinguri: `flex-col gap-4 sm:grid sm:grid-cols-2`
- Header sticky: `sticky top-0 z-50 bg-white/95 backdrop-blur`
- Carduri: `rounded-2xl` sau `rounded-3xl`, shadow-uri subtile

### Componente recurente
- `CategoryShell` — wrapper standard pentru orice pagină de categorie (header cu back, titlu, footer)
- `ListingCard` — card orizontal standard; acceptă `variant="event"` pentru afișare schedule
- `EmptyState` — placeholder uniform când nu sunt rezultate
- Filtre: butoane pill cu clasele `ACTIVE` / `INACTIVE` din fiecare FilteredX component

---

## CSS / Tailwind — probleme cunoscute

### Admin panel nestyled după restart
**Cauza:** Tailwind JIT nu detectează clasele din `_components/` la cold start, iar nested layout-ul admin nu prelua fontul/CSS-ul din root layout în mod fiabil.

**Soluția aplicată (permanentă):**
- `app/admin/layout.tsx` importă explicit `../globals.css` și aplică fontul Nunito printr-un `<div>` wrapper — **nu are `<html>`/`<body>` propriu**
- `tailwind.config.ts` are `safelist` explicit cu toate clasele generate dinamic din `CATEGORY_META` (gradiente + tagColor)

**Dacă problema reapare:**
1. Verifică că `app/admin/layout.tsx` importă `"../globals.css"` (nu adăuga `<html>`/`<body>` — e nested layout)
2. Verifică că `tailwind.config.ts` are `safelist` intact
3. Șterge `.next/` și repornește: `rm -rf .next && npm run dev`

### Clase dinamice (safelist)
Clasele din `CATEGORY_META` sunt compuse la runtime prin lookup (`meta.gradientFrom`, `meta.tagColor` etc.). Tailwind JIT nu le poate detecta static. Orice clasă nouă adăugată în `CATEGORY_META` din `ListingCard.tsx`, `page.tsx` sau `listing/[id]/page.tsx` trebuie adăugată și în `safelist`-ul din `tailwind.config.ts`.

---

## Note tehnice importante

### Storage poze — flux pending → aprobare
- Pozele din formularul public `/adauga-locatia-ta` se uploadează în `listings-images/pending/{timestamp}-{random}.ext`
- La aprobarea listingului din admin, pozele trebuie **MUTATE** în `listings-images/{listing-id}/`
- De implementat când facem dashboardul organizatorului: funcție `moveImages(pendingPaths, listingId)` care mută fișierele și actualizează URL-urile în coloana `images[]`
- Până atunci pozele rămân în `pending/` și funcționează, dar folderul se va aglomera în timp

---

## Note importante

- **Supabase client server** — `createClient` din `utils/supabase/server.ts` cere `cookieStore` ca parametru: `createClient(await cookies())`
- **`is_featured`** — listingurile featured apar în secțiunea "Recomandate această săptămână" de pe homepage (max 6)
- **`subcategory`** — coloana a fost adăugată ulterior; poate fi null pentru listinguri vechi
- **`SectionedEvenimente`** — împarte evenimentele în 3 secțiuni vizuale pe baza poziției în listă (coloana `event_date` există în DB dar nu e populată pentru evenimente manuale)
- **Imagini** — upload funcțional în admin și în formularul public; fallback gradient+emoji dacă `images[]` e gol; prima poză = cover pe carduri și hero pe pagina de detaliu
- **`/gradinite`** — redirect permanent către `/educatie` (după migrarea categoriilor)
- **`event_date`** — populat de scraper-ul Gong; folosit pe /spectacole pentru calendar și filtre temporale
