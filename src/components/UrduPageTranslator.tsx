"use client";

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { ur } from "@/data/ur";

const ATTRS = ["placeholder", "aria-label", "title", "alt"];
const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE"]);

/** "ISLAMABAD - MUSCAT" style route labels: translate each city, keep the dashes. */
function loose(key: string): string | undefined {
  if (!/^[A-Z]{3,}( [A-Z]+)*( - [A-Z]{3,}( [A-Z]+)*)+$/.test(key)) return undefined;
  const parts = key.split(" - ").map((c) => ur[c.charAt(0) + c.slice(1).toLowerCase()]);
  return parts.every(Boolean) ? parts.join(" ← ") : undefined;
}

const norm = (s: string) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();

/**
 * Swaps exact-match English text for Urdu across every page, so pages don't each need
 * wiring. Text nodes are edited in place (never replaced), which keeps React's DOM intact,
 * and originals are remembered so switching back to English restores them exactly.
 */
export default function UrduPageTranslator() {
  const lang = useLang();

  // Keep <html> in step with the stored language (covers reloads and other tabs).
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ur" ? "rtl" : "ltr");
  }, [lang]);

  useEffect(() => {
    if (lang !== "ur") return;

    const textOrig = new Map<Text, string>();
    const textSet = new Map<Text, string>();
    const attrOrig = new Map<Element, Record<string, string>>();

    const doText = (n: Text) => {
      const parent = n.parentElement;
      if (!parent || SKIP.has(parent.tagName) || parent.closest("[data-no-translate]")) return;
      const raw = n.nodeValue ?? "";
      if (textSet.get(n) === raw) return; // our own edit
      const key = norm(raw);
      const hit = key && (ur[key] ?? loose(key));
      if (!hit) return;
      textOrig.set(n, raw);
      const out = raw.replace(raw.trim(), hit);
      textSet.set(n, out);
      n.nodeValue = out;
    };

    const doAttrs = (el: Element) => {
      if (el.closest("[data-no-translate]")) return;
      for (const a of ATTRS) {
        const v = el.getAttribute(a);
        if (!v) continue;
        const hit = ur[norm(v)];
        if (!hit) continue;
        const saved = attrOrig.get(el) ?? {};
        saved[a] = saved[a] ?? v;
        attrOrig.set(el, saved);
        el.setAttribute(a, hit);
      }
    };

    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) return doText(root as Text);
      if (root.nodeType !== Node.ELEMENT_NODE) return;
      doAttrs(root as Element);
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      let cur = tw.nextNode();
      while (cur) {
        if (cur.nodeType === Node.TEXT_NODE) doText(cur as Text);
        else doAttrs(cur as Element);
        cur = tw.nextNode();
      }
    };

    walk(document.body);

    let queued: MutationRecord[] = [];
    let raf = 0;
    const flush = () => {
      raf = 0;
      const batch = queued;
      queued = [];
      for (const m of batch) {
        if (m.type === "characterData") doText(m.target as Text);
        else if (m.type === "attributes") doAttrs(m.target as Element);
        else m.addedNodes.forEach(walk);
      }
    };
    const observer = new MutationObserver((records) => {
      queued.push(...records);
      if (!raf) raf = requestAnimationFrame(flush);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      textOrig.forEach((orig, node) => {
        if (node.isConnected && textSet.get(node) === node.nodeValue) node.nodeValue = orig;
      });
      attrOrig.forEach((saved, el) => {
        for (const [a, v] of Object.entries(saved)) if (el.isConnected) el.setAttribute(a, v);
      });
    };
  }, [lang]);

  return null;
}
