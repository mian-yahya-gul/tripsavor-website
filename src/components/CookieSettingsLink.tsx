"use client";

import { resetConsent } from "@/lib/consent";
import { useT } from "@/lib/i18n";

export default function CookieSettingsLink() {
  const t = useT();
  return (
    <button type="button" onClick={resetConsent} className="underline-offset-2 hover:text-accent-400 hover:underline">
      {t("Cookie settings")}
    </button>
  );
}
