// scripts/scrape-gong.js
// Rulează cu: node scripts/scrape-gong.js
// Necesită Node 18+ (fetch nativ) și cheerio instalat

import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://www.teatrulgong.ro";
const LIST_URL = `${BASE_URL}/ro/events?ref_title=Calendarul+spectacolelor`;

const SUPABASE_URL = "https://isritlsmzejsxrygflih.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlzcml0bHNtemVqc3hyeWdmbGloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk1NzYzMCwiZXhwIjoyMDkwNTMzNjMwfQ.BugZjRKQ5d4KoI6EgINBB8iEoOqauRQYpo0kZvgwCog";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const MONTH_MAP = {
  Ian: 1, Feb: 2, Mar: 3, Apr: 4, Mai: 5, Iun: 6,
  Iul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

// Deduce year: dacă luna e în trecut față de luna curentă → anul următor
function guessYear(month) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  // Dacă luna e cu >2 luni în urmă, probabil e luna viitorului an
  return month < currentMonth - 2 ? currentYear + 1 : currentYear;
}

// Extrage URL-ul din `background-image: url("...")`
function extractBgUrl(styleStr) {
  const match = styleStr.match(/url\(['"]?([^'")\s]+)['"]?\)/);
  return match ? match[1] : null;
}

// Extrage prețul dintr-un text ("12 lei", "25 lei/bilet" etc.)
function extractPrice(text) {
  const match = text.match(/(\d+)\s*lei/i);
  return match ? `${match[1]} lei` : null;
}

async function fetchEventDetail(path) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KidsApp-scraper/1.0)" },
    });
    if (!res.ok) return {};
    const html = await res.text();
    const $ = cheerio.load(html);

    // Preț — caută "X lei" în pagină
    let price = null;
    $("body").find("*").each((_, el) => {
      const text = $(el).text();
      if (!price && /\d+\s*lei/i.test(text) && $(el).children().length === 0) {
        price = extractPrice(text);
      }
    });

    // Descriere — primul paragraf lung din zona de conținut
    let description = null;
    $(".event-description, .description, article, .content-area").find("p, div").each((_, el) => {
      const text = $(el).text().trim().replace(/\s+/g, " ");
      if (!description && text.length > 80 && text.length < 600) {
        description = text;
      }
    });

    return { price, description };
  } catch {
    return {};
  }
}

async function scrape() {
  console.log("📡 Fetch calendar spectacole Teatrul Gong...");
  const res = await fetch(LIST_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; KidsApp-scraper/1.0)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const html = await res.text();
  const $ = cheerio.load(html);

  const events = [];

  $(".event-box").each((_, box) => {
    const $box = $(box);

    // Titlu
    const title = $box.find(".title").text().trim();
    if (!title) return;

    // Link detaliu
    const href = $box.find("a[href^='/ro/events/']").first().attr("href") || null;

    // Imagine — din background-image al .cover-image
    const coverStyle = $box.find(".cover-image").attr("style") || "";
    const rawImgUrl = extractBgUrl(coverStyle);
    const imageUrl = rawImgUrl
      ? rawImgUrl.startsWith("http")
        ? rawImgUrl
        : `${BASE_URL}${rawImgUrl}`
      : null;

    // Zi și lună
    const dayText = $box.find(".day_month .day").text().trim();
    const monthText = $box.find(".day_month span").not(".day").first().text().trim();
    const day = parseInt(dayText, 10);
    const month = MONTH_MAP[monthText];

    // Oră — "Începe la 18:00"
    const timeText = $box.find(".full-date span").text().trim();
    const timeMatch = timeText.match(/(\d{1,2}):(\d{2})/);
    const hour = timeMatch ? parseInt(timeMatch[1], 10) : 0;
    const minute = timeMatch ? parseInt(timeMatch[2], 10) : 0;

    // Construiește event_date
    let event_date = null;
    if (day && month) {
      const year = guessYear(month);
      const d = new Date(year, month - 1, day, hour, minute, 0);
      event_date = d.toISOString();
    }

    // Grup vârstă (opțional, ca subcategory)
    const ageTag = $box.find(".category_tag").text().trim();

    events.push({ title, event_date, imageUrl, href, ageTag });
  });

  console.log(`🎭 Găsite ${events.length} spectacole/evenimente pe calendar\n`);

  let inserted = 0;
  let skipped = 0;

  for (const ev of events) {
    // Fetch detalii (preț + descriere) de pe pagina individuală
    const detail = ev.href ? await fetchEventDetail(ev.href) : {};

    // Construiește schedule din event_date
    let schedule = null;
    if (ev.event_date) {
      const d = new Date(ev.event_date);
      const dateStr = d.toLocaleDateString("ro-RO", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      const timeStr = d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" });
      schedule = `${dateStr} · ora ${timeStr}`;
    }

    const record = {
      name: ev.title,
      category: "spectacol",
      subcategory: ev.ageTag || null,
      description: detail.description || null,
      address: "Str. Alexandru Odobescu 4",
      city: "Sibiu",
      price: detail.price || null,
      schedule,
      event_date: ev.event_date || null,
      phone: "0269 211 349",
      website: "www.teatrulgong.ro",
      is_verified: true,
      is_featured: false,
      images: ev.imageUrl ? [ev.imageUrl] : [],
    };

    // Verifică duplicate după name + schedule
    const { data: existing } = await supabase
      .from("listings")
      .select("id")
      .eq("name", record.name)
      .eq("category", "spectacol")
      .eq("schedule", record.schedule ?? "")
      .maybeSingle();

    if (existing) {
      console.log(`⏭  Există deja: ${ev.title} (${schedule})`);
      skipped++;
      continue;
    }

    const { error } = await supabase.from("listings").insert(record);
    if (error) {
      console.error(`❌ Eroare la insert "${ev.title}": ${error.message}`);
    } else {
      console.log(`✅ Inserat: ${ev.title} (${schedule})`);
      inserted++;
    }

    // Pauză mică între requesturi
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n──────────────────────────────────`);
  console.log(`📊 REZULTATE:`);
  console.log(`   Găsite:   ${events.length}`);
  console.log(`   Inserate: ${inserted}`);
  console.log(`   Sărite:   ${skipped}`);
  console.log(`   Erori:    ${events.length - inserted - skipped}`);
}

scrape().catch((err) => {
  console.error("💥 Eroare fatală:", err);
  process.exit(1);
});
