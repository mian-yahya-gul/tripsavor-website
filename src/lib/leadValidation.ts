import type { EnquiryType } from "@/lib/db/types";

export type LeadInput = {
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  details?: Record<string, string>;
};

const TYPES: EnquiryType[] = ["contact", "group-tickets", "callback"];
const EMAIL_RE = /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/;
const PHONE_RE = /^[+\d][\d\s().-]{4,29}$/;

const MAX = { name: 100, email: 254, message: 5000, detailKey: 60, detailValue: 500, detailCount: 30 };

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max) : "";

/** Server-side validation + sanitising of a public form submission. Returns an error string or the clean lead. */
export function validateLead(body: unknown): { error: string } | { lead: LeadInput } {
  if (!body || typeof body !== "object") return { error: "Invalid request" };
  const b = body as Record<string, unknown>;

  if (typeof b.type !== "string" || !TYPES.includes(b.type as EnquiryType)) return { error: "Invalid type" };
  const name = clean(b.name, MAX.name);
  if (!name) return { error: "Name is required" };
  const email = clean(b.email, MAX.email);
  if (!EMAIL_RE.test(email)) return { error: "A valid email is required" };

  const lead: LeadInput = { type: b.type as EnquiryType, name, email };

  const phone = clean(b.phone, 30);
  if (phone) {
    if (!PHONE_RE.test(phone)) return { error: "Invalid phone number" };
    lead.phone = phone;
  }
  const message = clean(b.message, MAX.message);
  if (message) lead.message = message;

  if (b.details !== undefined) {
    if (!b.details || typeof b.details !== "object" || Array.isArray(b.details)) return { error: "Invalid details" };
    const entries = Object.entries(b.details as Record<string, unknown>).slice(0, MAX.detailCount);
    const details: Record<string, string> = {};
    for (const [k, v] of entries) {
      const key = clean(k, MAX.detailKey);
      const value = clean(typeof v === "string" ? v : v == null ? "" : String(v), MAX.detailValue);
      if (key && value) details[key] = value;
    }
    if (Object.keys(details).length) lead.details = details;
  }
  return { lead };
}
