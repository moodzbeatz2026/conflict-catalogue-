import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("Seeding database...");

  const { data: conflicts } = await supabase.from("conflicts").select("id, slug");
  const { data: entities } = await supabase.from("entities").select("id, name");

  if (!conflicts || !entities) {
    console.error("Failed to fetch conflicts or entities. Run the migration first.");
    process.exit(1);
  }

  const conflictMap = Object.fromEntries(conflicts.map((c) => [c.slug, c.id]));
  const entityMap = Object.fromEntries(entities.map((e) => [e.name, e.id]));

  const tagNames = [
    "hospital", "school", "residential area", "infrastructure",
    "civilian casualties", "prohibited weapons", "siege",
    "displacement", "media", "humanitarian aid",
  ];

  const { data: tags } = await supabase
    .from("tags")
    .upsert(
      tagNames.map((name) => ({
        name,
        slug: name.replace(/\s+/g, "-").toLowerCase(),
      })),
      { onConflict: "slug" }
    )
    .select("id, slug");

  const tagMap = Object.fromEntries((tags || []).map((t) => [t.slug, t.id]));

  const sampleIncidents = [
    {
      title: "Sample Incident: Airstrike on Medical Facility",
      slug: "sample-airstrike-medical-facility",
      date: "2024-01-15",
      date_precision: "exact" as const,
      summary: "This is a sample incident for development purposes. It demonstrates how entries appear in the timeline and on individual incident pages.",
      body: "## Background\n\nThis is a **sample incident** created for development and testing purposes. It demonstrates the full structure of an incident entry.\n\nThe body supports full Markdown formatting including:\n\n- **Bold text** and *italic text*\n- Bulleted lists\n- Numbered lists\n- Block quotes\n- Headers\n\n## Details\n\nAccording to multiple sources [1], this event was documented by international observers. Further reporting [2] confirmed additional details.\n\n> This is a blockquote demonstrating how quoted material appears in the body text.\n\n## Aftermath\n\nThe incident drew international attention and was documented by several human rights organisations [3].",
      location: "Sample City, Region",
      latitude: 31.5,
      longitude: 34.45,
      conflict_id: conflictMap["israel-palestine"],
      perpetrator_id: entityMap["Israel"],
      victims: "Civilian patients and medical staff",
      killed: 47,
      injured: 120,
      status: "published" as const,
    },
    {
      title: "Sample Incident: Attack on Residential Area",
      slug: "sample-attack-residential-area",
      date: "2024-02-20",
      date_precision: "exact" as const,
      summary: "A second sample incident demonstrating a different entry type with different tags and details.",
      body: "## Overview\n\nThis is a second sample incident to show how multiple entries appear in the timeline.\n\nReports from international media [1] documented the event in detail. Local sources [2] provided additional context.\n\n## Impact\n\nThe attack caused significant damage to civilian infrastructure and displaced numerous families.",
      location: "Another Location, Region",
      latitude: 31.8,
      longitude: 34.6,
      conflict_id: conflictMap["israel-palestine"],
      perpetrator_id: entityMap["IDF"],
      victims: "Civilian residents",
      killed: 12,
      injured: 45,
      status: "published" as const,
    },
    {
      title: "Sample Incident: Cross-Border Rocket Attack",
      slug: "sample-cross-border-rocket-attack",
      date: "2024-03-10",
      date_precision: "exact" as const,
      summary: "A third sample demonstrating an incident from a different perpetrator, showing how the catalogue covers multiple sides.",
      body: "## Incident\n\nThis sample demonstrates that the catalogue documents incidents from all parties to the conflicts.\n\nThe attack was reported by multiple news agencies [1] and condemned by international bodies [2].",
      location: "Border Town, Southern Region",
      latitude: 31.3,
      longitude: 34.3,
      conflict_id: conflictMap["palestine-israel"],
      perpetrator_id: entityMap["Hamas"],
      victims: "Civilian residents in border communities",
      killed: 3,
      injured: 15,
      status: "published" as const,
    },
  ];

  const { data: incidents, error: incidentError } = await supabase
    .from("incidents")
    .upsert(sampleIncidents, { onConflict: "slug" })
    .select("id, slug");

  if (incidentError) {
    console.error("Error inserting incidents:", incidentError);
    process.exit(1);
  }

  const incidentMap = Object.fromEntries(
    (incidents || []).map((i) => [i.slug, i.id])
  );

  const incidentTags = [
    { incident_id: incidentMap["sample-airstrike-medical-facility"], tag_id: tagMap["hospital"] },
    { incident_id: incidentMap["sample-airstrike-medical-facility"], tag_id: tagMap["civilian-casualties"] },
    { incident_id: incidentMap["sample-attack-residential-area"], tag_id: tagMap["residential-area"] },
    { incident_id: incidentMap["sample-attack-residential-area"], tag_id: tagMap["displacement"] },
    { incident_id: incidentMap["sample-cross-border-rocket-attack"], tag_id: tagMap["civilian-casualties"] },
  ];

  await supabase.from("incident_tags").upsert(incidentTags, { onConflict: "incident_id,tag_id" });

  const sources = [
    { incident_id: incidentMap["sample-airstrike-medical-facility"], url: "https://example.com/report-1", publication: "BBC News", title: "Sample Report: Medical Facility Struck", date_published: "2024-01-15", date_accessed: "2024-01-16", source_type: "news" as const, display_order: 0 },
    { incident_id: incidentMap["sample-airstrike-medical-facility"], url: "https://example.com/report-2", publication: "UN OCHA", title: "Flash Update: Incident in Sample City", date_published: "2024-01-16", date_accessed: "2024-01-17", source_type: "un_report" as const, display_order: 1 },
    { incident_id: incidentMap["sample-airstrike-medical-facility"], url: "https://example.com/report-3", publication: "Amnesty International", title: "Investigation into Sample Incident", date_published: "2024-02-01", date_accessed: "2024-02-02", source_type: "ngo_report" as const, display_order: 2 },
    { incident_id: incidentMap["sample-attack-residential-area"], url: "https://example.com/report-4", publication: "Al Jazeera", title: "Residential Area Hit in Second Sample", date_published: "2024-02-20", date_accessed: "2024-02-21", source_type: "news" as const, display_order: 0 },
    { incident_id: incidentMap["sample-attack-residential-area"], url: "https://example.com/report-5", publication: "Reuters", title: "Local Sources Describe Aftermath", date_published: "2024-02-21", date_accessed: "2024-02-22", source_type: "news" as const, display_order: 1 },
    { incident_id: incidentMap["sample-cross-border-rocket-attack"], url: "https://example.com/report-6", publication: "Associated Press", title: "Cross-Border Attack Reported", date_published: "2024-03-10", date_accessed: "2024-03-11", source_type: "news" as const, display_order: 0 },
    { incident_id: incidentMap["sample-cross-border-rocket-attack"], url: "https://example.com/report-7", publication: "UN Security Council", title: "Statement on Border Incident", date_published: "2024-03-12", date_accessed: "2024-03-13", source_type: "un_report" as const, display_order: 1 },
  ];

  await supabase.from("sources").upsert(sources);

  console.log("Seeding complete!");
  console.log(`  - ${tagNames.length} tags`);
  console.log(`  - ${sampleIncidents.length} incidents`);
  console.log(`  - ${incidentTags.length} incident-tag associations`);
  console.log(`  - ${sources.length} sources`);
}

seed().catch(console.error);
