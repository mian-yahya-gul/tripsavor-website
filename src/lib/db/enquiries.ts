import type { LeadInput } from "@/lib/leadValidation";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function newRef(prefix: string): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `${prefix}-${Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("")}`;
}

/**
 * Stores a public form submission: upserts the customer, inserts the enquiry and writes the first
 * status-history row. One atomic D1 batch (single round trip). Returns the customer-facing reference.
 */
export async function createEnquiry(db: D1Database, lead: LeadInput): Promise<string> {
  const ref = newRef("ENQ");
  const email = lead.email.toLowerCase();

  await db.batch([
    db
      .prepare(
        `INSERT INTO customers (email, full_name, phone) VALUES (?1, ?2, ?3)
         ON CONFLICT (email) DO UPDATE SET
           full_name = excluded.full_name,
           phone = COALESCE(excluded.phone, customers.phone),
           updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
      )
      .bind(email, lead.name, lead.phone ?? null),
    db
      .prepare(
        `INSERT INTO enquiries (public_ref, type, customer_id, name, email, phone, message, details_json)
         VALUES (?1, ?2, (SELECT id FROM customers WHERE email = ?3), ?4, ?3, ?5, ?6, ?7)`
      )
      .bind(
        ref,
        lead.type,
        email,
        lead.name,
        lead.phone ?? null,
        lead.message ?? null,
        lead.details ? JSON.stringify(lead.details) : null
      ),
    db
      .prepare(
        `INSERT INTO enquiry_events (enquiry_id, from_status, to_status)
         VALUES ((SELECT id FROM enquiries WHERE public_ref = ?1), NULL, 'new')`
      )
      .bind(ref),
  ]);

  return ref;
}

export async function markEnquiryEmailed(db: D1Database, ref: string): Promise<void> {
  await db
    .prepare(
      `UPDATE enquiries SET email_sent = 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE public_ref = ?1`
    )
    .bind(ref)
    .run();
}
