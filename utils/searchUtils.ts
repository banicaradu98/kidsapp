/** Strip Romanian (and common Latin) diacritics. Works in both Node and browser. */
export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[ăÃã]/g, "a")
    .replace(/[âÂ]/g, "a")
    .replace(/[îÎ]/g, "i")
    .replace(/[șşŞȘ]/g, "s")
    .replace(/[țţŢȚ]/g, "t");
}

/** Escape SQL LIKE wildcards and PostgREST filter special chars. */
export function sanitize(q: string): string {
  return q
    .replace(/[\\%_]/g, "\\$&") // escape LIKE wildcards
    .replace(/[(),]/g, "");     // remove PostgREST filter special chars
}

/**
 * Generic keywords → concrete search terms (brand names, Romanian synonyms, etc.)
 * Keys are already lowercased + diacritic-free (they're matched against normalizeText(query)).
 */
const KEYWORD_MAP: Record<string, string[]> = {
  teatru:       ["spectacol", "gong", "teatru"],
  spectacol:    ["spectacol", "gong", "piesa", "piesă"],
  piesa:        ["spectacol", "gong", "piesa", "piesă"],
  joaca:        ["loc-de-joaca", "joaca", "joacă", "indoor", "outdoor", "playground"],
  piscina:      ["inot", "înot", "aqua", "bazin", "swim", "piscina", "piscină"],
  inot:         ["inot", "înot", "aqua", "bazin", "swim", "serious fun", "aria"],
  fotbal:       ["fotbal", "alma", "tigrii", "fotbal"],
  dans:         ["dans", "balet", "dance", "forever", "dansuri"],
  balet:        ["balet", "dans", "dance", "forever"],
  robotica:     ["robotica", "robotică", "programare", "stem", "lego", "coding"],
  programare:   ["programare", "robotica", "robotică", "stem", "lego", "coding"],
  stem:         ["stem", "robotica", "robotică", "programare", "lego"],
  gradinita:    ["educatie", "educație", "gradinita", "grădinița", "grădinita", "cresa", "creșă"],
  cresa:        ["cresa", "creșă", "nursery", "educatie", "educație"],
  afterschool:  ["after-school", "afterschool", "after school", "after"],
  karate:       ["arte martiale", "arte marțiale", "hwarang", "karate", "judo", "taekwondo"],
  arte:         ["arte martiale", "arte marțiale", "hwarang", "karate", "judo"],
  engleza:      ["engleza", "engleză", "limbi straine", "limbi străine", "lexis", "english"],
  germana:      ["germana", "germană", "deutsch", "blitz", "km education"],
  franceza:     ["franceza", "franceză", "french", "francais"],
  pictura:      ["desen", "pictura", "pictură", "arta", "artă", "atelier", "creativ"],
  desen:        ["desen", "pictura", "pictură", "arta", "artă", "atelier"],
  muzica:       ["muzica", "muzică", "chitara", "chitară", "pian", "vioara", "vioară", "vocal"],
  chitara:      ["chitara", "chitară", "muzica", "muzică", "pian"],
  pian:         ["pian", "muzica", "muzică", "chitara", "chitară"],
  tenis:        ["tenis", "tennis"],
  gimnastica:   ["gimnastica", "gimnastică", "acrobatie", "acrobație"],
  acrobatie:    ["acrobatie", "acrobație", "gimnastica", "gimnastică"],
  yoga:         ["yoga", "meditatie", "meditație", "mindfulness"],
  sah:          ["sah", "șah", "chess"],
  teatru_papusi: ["papusi", "păpuși", "marioneta", "marionete"],
  papusi:       ["papusi", "păpuși", "teatru", "spectacol"],
};

/**
 * Expand a raw query into all search terms to use in PostgREST OR filters.
 * Returns max 6 unique sanitized terms to keep queries manageable.
 */
export function expandQuery(rawQ: string): string[] {
  const norm = normalizeText(rawQ.trim());
  const seen: Record<string, boolean> = {};
  const terms: string[] = [];

  function add(t: string) {
    if (t && !seen[t]) { seen[t] = true; terms.push(t); }
  }

  // Always include the original and normalized forms
  add(sanitize(rawQ.trim()));
  add(sanitize(norm));

  // Keyword expansion (matched against normalized query)
  const expansions = KEYWORD_MAP[norm] ?? KEYWORD_MAP[sanitize(norm)] ?? null;
  if (expansions) {
    for (const e of expansions) {
      add(sanitize(e));
      add(sanitize(normalizeText(e)));
      if (terms.length >= 8) break; // cap to keep query size reasonable
    }
  }

  return terms.slice(0, 8);
}

/**
 * Build a PostgREST OR filter string for multiple terms across multiple fields.
 * e.g. buildOrFilter(["inot","aqua"], ["name","description"])
 *   → "name.ilike.%inot%,description.ilike.%inot%,name.ilike.%aqua%,description.ilike.%aqua%"
 */
export function buildOrFilter(terms: string[], fields: string[]): string {
  const parts: string[] = [];
  for (const term of terms) {
    for (const field of fields) {
      parts.push(`${field}.ilike.%${term}%`);
    }
  }
  return parts.join(",");
}
