-- Metadata for private documents kept in R2 (bucket `tripsavor-private`). The bytes never live in D1.
CREATE TABLE files (
  id            INTEGER PRIMARY KEY,
  r2_key        TEXT NOT NULL UNIQUE,                          -- opaque server-generated key, never user input
  owner_type    TEXT NOT NULL CHECK (owner_type IN ('enquiry', 'booking')),
  owner_id      INTEGER NOT NULL,
  original_name TEXT NOT NULL,                                 -- display only; sanitised, never used in the key
  content_type  TEXT NOT NULL CHECK (content_type IN ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes    INTEGER NOT NULL CHECK (size_bytes > 0),
  uploaded_by   TEXT NOT NULL DEFAULT 'customer',              -- 'customer' or a staff email
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_files_owner ON files (owner_type, owner_id);
