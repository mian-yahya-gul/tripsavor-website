"use client";

import { Languages } from "lucide-react";
import { setLang, useLang } from "@/lib/i18n";

export default function LangToggle() {
  const lang = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ur" ? "en" : "ur")}
      className="flex items-center gap-1.5 hover:text-accent-400"
      aria-label={lang === "ur" ? "Switch to English" : "اردو میں دیکھیں"}
    >
      <Languages size={12} />
      {lang === "ur" ? "English" : "اردو"}
    </button>
  );
}
