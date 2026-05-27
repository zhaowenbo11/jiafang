-- Showroom database schema for future production use.

CREATE TABLE businesses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  accent TEXT NOT NULL,
  accent_soft TEXT NOT NULL,
  tone TEXT NOT NULL,
  customer_profile TEXT NOT NULL,
  result_title TEXT NOT NULL,
  result_summary TEXT NOT NULL,
  result_template_summary TEXT NOT NULL
);

CREATE TABLE fabric_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE fabrics (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  craft TEXT NOT NULL,
  season TEXT NOT NULL,
  price_range TEXT NOT NULL,
  description TEXT NOT NULL,
  swatch TEXT NOT NULL,
  secondary_swatch TEXT NOT NULL,
  detail_swatch TEXT NOT NULL,
  preview_gradient TEXT NOT NULL,
  preview_label TEXT NOT NULL,
  pattern TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id TEXT NOT NULL,
  name TEXT NOT NULL,
  detail TEXT NOT NULL,
  preview_tag TEXT NOT NULL,
  layout TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (business_id) REFERENCES businesses(id)
);

CREATE TABLE preview_jobs (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL,
  fabric_id TEXT NOT NULL,
  template_id INTEGER,
  prompt TEXT NOT NULL,
  status TEXT NOT NULL,
  result_image_url TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
