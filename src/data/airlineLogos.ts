/** Slugs of the logo files that exist in public/airlines (all .png). */
const LOGO_SLUGS = new Set([
  "china-southern",
  "emirates",
  "air-arabia",
  "turkish-airlines",
  "qatar-airways",
  "oman-air",
  "malindo-air",
  "virgin-atlantic",
  "kuwait-airways",
  "british-airways",
  "saudia",
  "thai-airways",
  "airblue",
  "flydubai",
  "pakistan-international-airlines",
]);

export function airlineLogo(name: string): string | null {
  const slug = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return LOGO_SLUGS.has(slug) ? `/airlines/${slug}.png` : null;
}
