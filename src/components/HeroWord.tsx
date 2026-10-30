"use client";

import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

const WORDS = ["Dubai", "London", "Istanbul", "Jeddah", "Bangkok", "Toronto"];

/** Cycles through popular destinations; stays static for reduced-motion users. */
export default function HeroWord() {
  const t = useT();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="hero-wrap relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <span key={WORDS[i]} className="hero-word inline-block text-accent-400">
        {t(WORDS[i])}
      </span>
    </span>
  );
}
