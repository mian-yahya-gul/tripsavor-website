-- TripSavor core schema. Safe to apply incrementally via `wrangler d1 migrations apply`.
-- Conventions:
--   * ids are INTEGER PRIMARY KEY; customer-facing references are separate `public_ref` values
--   * timestamps are ISO-8601 UTC text (strftime default below)
--   * money is stored as integer minor units (e.g. paisa/fils/cents) next to an ISO-4217 currency code
--   * NO card numbers, CVVs, passport scans or passport numbers are stored in D1 (documents go to R2)

PRAGMA foreign_keys = ON;

CREATE TABLE destinations (
  id          INTEGER PRIMARY KEY,
  code        TEXT NOT NULL UNIQUE CHECK (length(code) = 3),   -- IATA airport/city code
  city        TEXT NOT NULL,
  country     TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  is_active   INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE travel_packages (
  id              INTEGER PRIMARY KEY,
  destination_id  INTEGER REFERENCES destinations (id) ON DELETE SET NULL,
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT,
  duration_days   INTEGER CHECK (duration_days IS NULL OR duration_days > 0),
  price_minor     INTEGER NOT NULL CHECK (price_minor >= 0),
  currency        TEXT NOT NULL DEFAULT 'PKR' CHECK (length(currency) = 3),
  is_active       INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_packages_destination ON travel_packages (destination_id);

CREATE TABLE customers (
  id          INTEGER PRIMARY KEY,
  email       TEXT NOT NULL COLLATE NOCASE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE UNIQUE INDEX idx_customers_email ON customers (email);

CREATE TABLE enquiries (
  id            INTEGER PRIMARY KEY,
  public_ref    TEXT NOT NULL UNIQUE,                         -- e.g. ENQ-7K3QX9, safe to show to the customer
  type          TEXT NOT NULL CHECK (type IN ('contact', 'group-tickets', 'callback')),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'quoted', 'won', 'lost', 'spam')),
  customer_id   INTEGER REFERENCES customers (id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  message       TEXT,
  details_json  TEXT,                                          -- form-specific fields as JSON (size-limited in code)
  email_sent    INTEGER NOT NULL DEFAULT 0 CHECK (email_sent IN (0, 1)),
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_enquiries_status_created ON enquiries (status, created_at DESC);
CREATE INDEX idx_enquiries_customer ON enquiries (customer_id);

CREATE TABLE enquiry_events (
  id          INTEGER PRIMARY KEY,
  enquiry_id  INTEGER NOT NULL REFERENCES enquiries (id) ON DELETE CASCADE,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  note        TEXT,
  actor       TEXT NOT NULL DEFAULT 'system',                  -- staff email or 'system'
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_enquiry_events_enquiry ON enquiry_events (enquiry_id, created_at);

CREATE TABLE bookings (
  id            INTEGER PRIMARY KEY,
  public_ref    TEXT NOT NULL UNIQUE,                          -- e.g. TS-4F8K2M
  customer_id   INTEGER NOT NULL REFERENCES customers (id) ON DELETE RESTRICT,
  package_id    INTEGER REFERENCES travel_packages (id) ON DELETE SET NULL,
  enquiry_id    INTEGER REFERENCES enquiries (id) ON DELETE SET NULL,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ticketed', 'cancelled', 'refunded')),
  currency      TEXT NOT NULL DEFAULT 'PKR' CHECK (length(currency) = 3),
  total_minor   INTEGER NOT NULL DEFAULT 0 CHECK (total_minor >= 0),
  itinerary_json TEXT,                                         -- route, dates, airline, PNR etc.
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_bookings_customer ON bookings (customer_id);
CREATE INDEX idx_bookings_status_created ON bookings (status, created_at DESC);
CREATE INDEX idx_bookings_enquiry ON bookings (enquiry_id);

CREATE TABLE passengers (
  id             INTEGER PRIMARY KEY,
  booking_id     INTEGER NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
  full_name      TEXT NOT NULL,
  passenger_type TEXT NOT NULL DEFAULT 'adult' CHECK (passenger_type IN ('adult', 'child', 'infant')),
  date_of_birth  TEXT,                                         -- YYYY-MM-DD
  nationality    TEXT,
  -- passport numbers / scans are intentionally NOT stored here; scans live in private R2
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_passengers_booking ON passengers (booking_id);

CREATE TABLE payments (
  id            INTEGER PRIMARY KEY,
  booking_id    INTEGER NOT NULL REFERENCES bookings (id) ON DELETE RESTRICT,
  amount_minor  INTEGER NOT NULL CHECK (amount_minor > 0),
  currency      TEXT NOT NULL CHECK (length(currency) = 3),
  method        TEXT NOT NULL CHECK (method IN ('card', 'bank_transfer', 'cash', 'other')),
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  provider      TEXT,                                          -- gateway name once one is chosen
  provider_ref  TEXT,                                          -- gateway transaction id (never card data)
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_payments_booking ON payments (booking_id);
CREATE UNIQUE INDEX idx_payments_provider_ref ON payments (provider, provider_ref) WHERE provider_ref IS NOT NULL;

CREATE TABLE booking_events (
  id          INTEGER PRIMARY KEY,
  booking_id  INTEGER NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
  from_status TEXT,
  to_status   TEXT NOT NULL,
  note        TEXT,
  actor       TEXT NOT NULL DEFAULT 'system',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_booking_events_booking ON booking_events (booking_id, created_at);
