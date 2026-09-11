import { Plane } from "lucide-react";
import type { GroupCategoryId } from "@/data/groupTickets";

/**
 * Per-category monoline illustrations for the group-ticket tiles — replaces
 * the single generic icon with a distinct, brand-colored landmark motif per
 * destination group so the tiles read as different places at a glance.
 */

type ArtProps = { className?: string };

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Umrah & Hajj — the Kaaba, draped, with the Grand Mosque's minarets either side. */
function UmrahArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <rect x="38" y="24" width="24" height="24" />
      <line x1="38" y1="32" x2="62" y2="32" />
      <line x1="18" y1="48" x2="18" y2="16" />
      <path d="M14 16 L18 6 L22 16" />
      <line x1="82" y1="48" x2="82" y2="16" />
      <path d="M78 16 L82 6 L86 16" />
      <line x1="10" y1="48" x2="90" y2="48" />
    </svg>
  );
}

/** UAE — Burj Khalifa taper. */
function UaeArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <line x1="50" y1="4" x2="50" y2="14" />
      <polygon points="44,52 47,14 53,14 56,52" />
      <line x1="40" y1="52" x2="60" y2="52" />
    </svg>
  );
}

/** KSA — a mosque dome flanked by a single tall minaret. */
function KsaArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <path d="M30 48 V36 A16 16 0 0 1 62 36 V48 Z" />
      <line x1="78" y1="48" x2="78" y2="14" />
      <path d="M74 14 L78 4 L82 14" />
      <line x1="18" y1="48" x2="86" y2="48" />
    </svg>
  );
}

/** UK — Big Ben clock tower + a nod to the London Eye. */
function UkArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <rect x="40" y="12" width="12" height="36" />
      <path d="M40 12 L46 4 L52 12" />
      <circle cx="46" cy="22" r="3.5" />
      <circle cx="74" cy="34" r="13" />
      <line x1="61" y1="34" x2="87" y2="34" />
      <line x1="24" y1="48" x2="87" y2="48" />
    </svg>
  );
}

/** Muscat — Grand Mosque dome with a slender minaret. */
function MuscatArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <path d="M28 48 V38 A14 14 0 0 1 54 38 V48 Z" />
      <circle cx="41" cy="24" r="2" />
      <line x1="41" y1="26" x2="41" y2="24" />
      <line x1="74" y1="48" x2="74" y2="16" />
      <path d="M70 16 L74 6 L78 16" />
      <line x1="16" y1="48" x2="86" y2="48" />
    </svg>
  );
}

/** Qatar — Doha's curved corniche towers. */
function QatarArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <path d="M40 48 V20 Q40 10 52 10 V48" />
      <rect x="60" y="26" width="10" height="22" />
      <rect x="24" y="34" width="9" height="14" />
      <line x1="18" y1="48" x2="82" y2="48" />
    </svg>
  );
}

/** Bahrain — the Bahrain World Trade Center's twin sail-shaped towers. */
function BahrainArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 100 60" className={className} {...strokeProps}>
      <path d="M40 48 V18 Q44 10 40 4" />
      <path d="M60 48 V18 Q56 10 60 4" />
      <line x1="40" y1="30" x2="60" y2="30" />
      <line x1="24" y1="48" x2="76" y2="48" />
    </svg>
  );
}

const artByCategory: Record<GroupCategoryId, (p: ArtProps) => React.JSX.Element> = {
  umrah: UmrahArt,
  uae: UaeArt,
  ksa: KsaArt,
  uk: UkArt,
  muscat: MuscatArt,
  qatar: QatarArt,
  bahrain: BahrainArt,
};

export function GroupCategoryArt({
  category,
  className,
}: {
  category: GroupCategoryId;
  className?: string;
}) {
  const Art = artByCategory[category];
  if (!Art) return <Plane className={className} />;
  return <Art className={className} />;
}
