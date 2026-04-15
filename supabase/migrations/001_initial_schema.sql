-- Enums
CREATE TYPE date_precision AS ENUM ('exact', 'month', 'approximate');
CREATE TYPE incident_status AS ENUM ('draft', 'published');
CREATE TYPE entity_type AS ENUM ('state', 'military', 'organisation');
CREATE TYPE source_type AS ENUM ('news', 'un_report', 'ngo_report', 'legal_filing', 'primary_source', 'other');

-- Conflicts
CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Entities (states, organisations, militaries)
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type entity_type NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Incidents (core table)
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  date DATE NOT NULL,
  date_precision date_precision NOT NULL DEFAULT 'exact',
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL,
  longitude DECIMAL,
  conflict_id UUID NOT NULL REFERENCES conflicts(id),
  perpetrator_id UUID NOT NULL REFERENCES entities(id),
  victims TEXT,
  killed INTEGER,
  injured INTEGER,
  status incident_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sources (citations for incidents)
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  publication TEXT NOT NULL,
  author TEXT,
  title TEXT NOT NULL,
  date_published DATE,
  date_accessed DATE NOT NULL DEFAULT CURRENT_DATE,
  source_type source_type NOT NULL DEFAULT 'news',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Images
CREATE TABLE images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  caption TEXT,
  attribution TEXT,
  date_taken DATE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Incident-Tag join table
CREATE TABLE incident_tags (
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, tag_id)
);

-- Incident-Affected Entities join table
CREATE TABLE incident_affected_entities (
  incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  PRIMARY KEY (incident_id, entity_id)
);

-- Indexes for performance
CREATE INDEX idx_incidents_date ON incidents(date DESC);
CREATE INDEX idx_incidents_conflict ON incidents(conflict_id);
CREATE INDEX idx_incidents_perpetrator ON incidents(perpetrator_id);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_slug ON incidents(slug);
CREATE INDEX idx_sources_incident ON sources(incident_id);
CREATE INDEX idx_images_incident ON images(incident_id);
CREATE INDEX idx_incident_tags_tag ON incident_tags(tag_id);

-- Full-text search index
ALTER TABLE incidents ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'C')
  ) STORED;

CREATE INDEX idx_incidents_search ON incidents USING gin(search_vector);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_affected_entities ENABLE ROW LEVEL SECURITY;

-- Public read access for published content only
CREATE POLICY "Public can read conflicts" ON conflicts FOR SELECT USING (true);
CREATE POLICY "Public can read entities" ON entities FOR SELECT USING (true);
CREATE POLICY "Public can read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can read published incidents" ON incidents FOR SELECT USING (status = 'published');
CREATE POLICY "Public can read sources" ON sources FOR SELECT USING (
  EXISTS (SELECT 1 FROM incidents WHERE incidents.id = sources.incident_id AND incidents.status = 'published')
);
CREATE POLICY "Public can read images" ON images FOR SELECT USING (
  EXISTS (SELECT 1 FROM incidents WHERE incidents.id = images.incident_id AND incidents.status = 'published')
);
CREATE POLICY "Public can read incident_tags" ON incident_tags FOR SELECT USING (
  EXISTS (SELECT 1 FROM incidents WHERE incidents.id = incident_tags.incident_id AND incidents.status = 'published')
);
CREATE POLICY "Public can read incident_affected_entities" ON incident_affected_entities FOR SELECT USING (
  EXISTS (SELECT 1 FROM incidents WHERE incidents.id = incident_affected_entities.incident_id AND incidents.status = 'published')
);

-- Seed initial conflicts
INSERT INTO conflicts (name, slug, description) VALUES
  ('Israel-Palestine', 'israel-palestine', 'Documenting incidents in the Israeli-Palestinian conflict'),
  ('Palestine-Israel', 'palestine-israel', 'Documenting incidents by Palestinian entities against Israel'),
  ('Israel-Lebanon', 'israel-lebanon', 'Documenting incidents in the Israeli-Lebanese conflict');

-- Seed initial entities
INSERT INTO entities (name, type, description) VALUES
  ('Israel', 'state', 'State of Israel'),
  ('Palestine', 'state', 'State of Palestine'),
  ('IDF', 'military', 'Israel Defense Forces'),
  ('Hamas', 'organisation', 'Palestinian political and military organisation'),
  ('Hezbollah', 'organisation', 'Lebanese political and military organisation'),
  ('Lebanon', 'state', 'Republic of Lebanon');
