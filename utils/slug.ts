export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[sșş]/g, "s")
    .replace(/[tțţ]/g, "t")
    .replace(/[aăâ]/g, "a")
    .replace(/[iî]/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateUniqueSlug(name: string, supabase: any): Promise<string> {
  const base = generateSlug(name);
  let slug = base;
  let counter = 1;
  while (true) {
    const { data } = await supabase
      .from("listings")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data) return slug;
    slug = `${base}-${counter++}`;
  }
}