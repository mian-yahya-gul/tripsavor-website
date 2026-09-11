import { siteConfig } from "@/data/site";

/**
 * Single source of truth for every WhatsApp touchpoint on the site. This is
 * the primary booking channel for the human-assisted flow (see the market
 * brief) — centralizing it means the reply-time honesty and link format
 * can't drift out of sync between components the way they used to.
 */

const OPEN_HOUR = 8;
const CLOSE_HOUR = 23;

export function isAgentsOnline(): boolean {
  const h = new Date().getHours();
  return h >= OPEN_HOUR && h < CLOSE_HOUR;
}

export function replyEstimate(): string {
  return isAgentsOnline() ? "a few minutes" : "15–30 minutes";
}

export function buildWhatsAppLink(message?: string): string {
  const number = siteConfig.whatsapp.replace(/[^0-9]/g, "");
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}
