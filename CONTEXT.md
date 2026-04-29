# Moosey — Harta Proiectului

## Autentificare
- app/components/AuthModal.tsx — login/register/forgot password
- app/reset-password/page.tsx — setare parolă nouă
- app/auth/callback/route.ts — callback OAuth

## Admin
- app/admin/page.tsx — dashboard admin principal
- app/admin/actions.ts — server actions: aprobare/respingere listing și claim
- app/admin/aprobare/page.tsx — listinguri pending spre aprobare
- app/admin/_components/ListingFormFields.tsx — formular listing
- app/admin/_components/ApproveListingButton.tsx — buton aprobare

## Dashboard Organizator
- app/dashboard/page.tsx — dashboard principal organizator
- app/dashboard/EventsManager.tsx — gestionare evenimente

## Homepage
- app/page.tsx — homepage: hero, categorii, calendar, marketplace, featured

## Calendar
- app/calendar/page.tsx — pagina /calendar cu toate evenimentele

## Pagini Categorii
- app/loc-de-joaca/page.tsx
- app/educatie/page.tsx
- app/curs-atelier/page.tsx
- app/sport/page.tsx
- app/spectacole/page.tsx
- app/evenimente/page.tsx

## Listing
- app/listing/[id]/page.tsx — pagina listing cu redirect la slug
- app/[category]/[slug]/page.tsx — pagina listing cu slug
- app/listing/[id]/ClaimButton.tsx — buton revendicare

## Formular Public
- app/adauga-locatia-ta/page.tsx
- app/adauga-locatia-ta/SubmitForm.tsx — formular adaugare locatie

## Marketplace
- app/marketplace/page.tsx — pagina principala marketplace
- app/marketplace/[id]/page.tsx — pagina anunt individual
- app/marketplace/adauga/page.tsx — formular adaugare anunt

## Pagini Informationale
- app/despre/page.tsx
- app/contact/page.tsx
- app/cum-functioneaza/page.tsx
- app/politica-de-confidentialitate/page.tsx
- app/termeni-si-conditii/page.tsx
- app/gdpr/page.tsx

## API Routes
- app/api/approve-listing/route.ts — aprobare listing + email organizator
- app/api/send-confirmation/route.ts — email confirmare submit locatie noua
- app/api/delete-account/route.ts — stergere cont complet
- app/api/pause-account/route.ts — pauza cont

## Componente Principale
- app/components/AuthModal.tsx — autentificare
- app/components/Footer.tsx — footer
- app/components/MascotFloat.tsx — mascota flotanta
- app/components/MascotCelebration.tsx — confetti + mascota
- app/components/MascotLoader.tsx — loader cu mascota
- app/components/RichTextEditor.tsx — editor TipTap
- app/components/RichTextDisplay.tsx — afisare HTML rich text
- app/MobileMenu.tsx — meniu mobil

## Utilitare
- utils/slug.ts — generare slug unic
- utils/packages.ts — configuratie pachete Free/Standard/Pro
- utils/supabase/client.ts — Supabase client side
- utils/supabase/server.ts — Supabase server side
- utils/supabase/admin.ts — Supabase admin (service role, bypass RLS)

## Scripts
- scripts/scrape-gong.js — scraper Teatrul Gong (rulat saptamanal)

## Configuratie
- next.config.js sau next.config.mjs — configuratie Next.js, CSP headers
- app/layout.tsx — layout global, metadata, Google Analytics
- app/globals.css — stiluri globale, animatii mascota
- .env.local — variabile de mediu locale

## Tabele Supabase
- listings — id, name, category, subcategory, description, slug,
  address, city, price, images[], is_verified, is_featured,
  claimed_by, claimed_at, package, event_date, event_end_date,
  start_time, end_time, contact_email, status, created_at
- reviews — id, listing_id, user_id, rating, text, hidden, created_at
- user_favorites — id, user_id, listing_id, created_at
- profiles — id, full_name, avatar_url, role, package,
  package_expires_at, newsletter_consent, account_status, paused_at
- claims — id, listing_id, user_id, email, message,
  status (pending/approved/rejected), rejected_at, created_at
- events — id, listing_id, user_id, title, description,
  event_date, start_time, end_time, price, thumbnail_url,
  gallery_urls[], created_at
- listing_views — id, listing_id, viewed_at, user_agent
- listing_updates — id, listing_id, user_id, type, title,
  message, images[], expires_at, created_at
- marketplace_listings — id, user_id, title, description,
  category, condition, type, price, price_per_day, images[],
  city, contact_preference, phone, status, created_at
- marketplace_messages — id, listing_id, sender_id,
  receiver_id, message, read, created_at
- marketplace_favorites — id, user_id, listing_id, created_at
- contact_messages — id, name, email, subject, message,
  status, created_at

## Bucket-uri Supabase Storage
- listings-images — poze listings, events, updates
- marketplace-images — poze anunturi marketplace
- avatars — poze profil utilizatori

## Environment Variables necesare
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD
- NEXT_PUBLIC_SITE_URL=https://www.moosey.ro
- NEXT_PUBLIC_GA_ID=G-6D3GH3PNSV
- BREVO_API_KEY
