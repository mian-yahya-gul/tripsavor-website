import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site";
import { getDb } from "@/lib/db";
import { createEnquiry, markEnquiryEmailed } from "@/lib/db/enquiries";
import { validateLead, type LeadInput } from "@/lib/leadValidation";

/**
 * Single delivery point for every "someone filled out a form" event on the
 * site (Contact page, Group Tickets request). Every submission is
 * saved to D1 first (so it can never be lost), then emailed via Resend when
 * RESEND_API_KEY is set. This is the one place a real API key needs to be
 * dropped in — see README for setup.
 */

const SUBJECTS: Record<LeadInput["type"], string> = {
  contact: "New contact form message from",
  "group-tickets": "New group ticket request from",
  callback: "New callback request from",
};

function subjectFor(payload: LeadInput) {
  return `${SUBJECTS[payload.type]} ${payload.name}`;
}

function textFor(payload: LeadInput, ref?: string) {
  const lines = [
    ref ? `Reference: ${ref}` : null,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    ...(payload.details
      ? Object.entries(payload.details).map(([k, v]) => `${k}: ${v}`)
      : []),
    payload.message ? `\nMessage:\n${payload.message}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

async function sendViaResend(payload: LeadInput, ref?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { delivered: false, reason: "RESEND_API_KEY not set" };

  const to = process.env.LEAD_TO_EMAIL || siteConfig.email;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's shared sandbox sender — works without domain verification.
      // Swap for an address on a domain you've verified with Resend once ready.
      from: "TripSavor Website <onboarding@resend.dev>",
      to: [to],
      reply_to: payload.email,
      subject: subjectFor(payload),
      text: textFor(payload, ref),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend request failed: ${res.status} ${detail}`);
  }
  return { delivered: true };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = validateLead(body);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  const { lead } = parsed;

  // 1) Persist. A storage failure must not lose the lead if email still works.
  let db: D1Database | null = null;
  let ref: string | undefined;
  try {
    db = getDb();
    ref = await createEnquiry(db, lead);
  } catch (err) {
    console.error("[api/lead] storage failed", { type: lead.type, error: err instanceof Error ? err.message : "unknown" });
  }

  // 2) Notify by email (best effort when stored; required when not).
  let delivered = false;
  try {
    delivered = (await sendViaResend(lead, ref)).delivered;
    if (delivered && db && ref) await markEnquiryEmailed(db, ref).catch(() => {});
  } catch (err) {
    console.error("[api/lead] email failed", { type: lead.type, ref, error: err instanceof Error ? err.message : "unknown" });
  }

  if (!ref && !delivered) {
    // Neither stored nor emailed. Log type only — never customer details.
    console.warn("[api/lead] lead neither stored nor emailed", { type: lead.type });
    return NextResponse.json({ ok: false, error: "Could not record your request" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered, ref });
}
