export type DatePrecision = "exact" | "month" | "approximate";
export type IncidentStatus = "draft" | "published";
export type EntityType = "state" | "military" | "organisation";
export type SourceType =
  | "news"
  | "un_report"
  | "ngo_report"
  | "legal_filing"
  | "primary_source"
  | "other";

export interface Conflict {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Incident {
  id: string;
  title: string;
  slug: string;
  date: string;
  date_precision: DatePrecision;
  summary: string;
  body: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  conflict_id: string;
  perpetrator_id: string;
  victims: string | null;
  killed: number | null;
  injured: number | null;
  status: IncidentStatus;
  created_at: string;
  updated_at: string;
}

export interface IncidentWithRelations extends Incident {
  conflict: Conflict;
  perpetrator: Entity;
  sources: Source[];
  images: IncidentImage[];
  tags: Tag[];
  affected_entities: Entity[];
}

export interface Source {
  id: string;
  incident_id: string;
  url: string;
  publication: string;
  author: string | null;
  title: string;
  date_published: string | null;
  date_accessed: string;
  source_type: SourceType;
  display_order: number;
}

export interface IncidentImage {
  id: string;
  incident_id: string;
  file_path: string;
  caption: string | null;
  attribution: string | null;
  date_taken: string | null;
  display_order: number;
}

export interface TimelineEntry {
  id: string;
  title: string;
  slug: string;
  date: string;
  date_precision: DatePrecision;
  summary: string;
  location: string;
  killed: number | null;
  injured: number | null;
  conflict: { name: string; slug: string };
  perpetrator: { name: string };
  tags: Tag[];
  thumbnail: { file_path: string; caption: string | null } | null;
}

export interface TimelineFilters {
  search?: string;
  conflict?: string;
  tag?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
}
