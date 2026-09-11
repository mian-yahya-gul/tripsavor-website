import { NextResponse } from "next/server";
import { siteConfig } from "@/data/site";

/**
 * Single delivery point for every "someone filled out a form" event on the
 * site (Contact page, Group Tickets request). Sends via Resend when
 * RESEND_API_KEY is set; otherwise logs server-side so nothing is silently
 * lost during local dev. This is the one place a real API key needs to be
 * dropped in — see README for setup.
 */

type LeadPayload = {
  type: "contact" | "group-tickets" | "callback";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  details?: Record<string, string>;
};

function isValid(body: unknown): body is LeadPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    (b.type === "contact" || b.type === "group-tickets" || b.type === "callback") &&
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.email === "string"
  );
}

const SUBJECTS: Record<LeadPayload["type"], string> = {
  contact: "New contact form message from",
  "group-tickets": "New group ticket request from",
  callback: "New callback request from",
};

function subjectFor(payload: LeadPayload) {
  return `${SUBJECTS[payload.type]} ${payload.name}`;
}

function textFor(payload: LeadPayload) {
  const lines = [
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

async function sendViaResend(payload: LeadPayload) {
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
      text: textFor(payload),
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

  if (!isValid(body)) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  try {
    const result = await sendViaResend(body);
    if (!result.delivered) {
      // No API key configured yet — keep the lead visible in server logs
      // instead of dropping it silently.
      console.warn("[api/lead] RESEND_API_KEY not set — lead logged, not emailed:", {
        type: body.type,
        name: body.name,
        email: body.email,
        phone: body.phone,
      });
    }
    return NextResponse.json({ ok: true, delivered: result.delivered });
  } catch (err) {
    console.error("[api/lead] delivery failed", err);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }
}
