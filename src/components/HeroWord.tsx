"use client";

import { useEffect, useState } from "react";

const WORDS = ["Dubai", "London", "Istanbul", "Jeddah", "Bangkok", "Toronto"];

/** Cycles through popular destinations; stays static for reduced-motion users. */
export default function HeroWord() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <span key={WORDS[i]} className="hero-word inline-block text-accent-400">
        {WORDS[i]}
      </span>
    </span>
  );
}
