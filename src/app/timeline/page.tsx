import { createServerClient } from "@/lib/supabase/server";
import { TimelineList } from "@/components/timeline/timeline-list";
import { TimelineFilters } from "@/components/timeline/timeline-filters";
import type { TimelineEntry, Tag } from "@/lib/types";

const PAGE_SIZE = 20;

interface TimelinePageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    conflict?: string;
    tag?: string;
    date_from?: string;
    date_to?: string;
  }>;
}

export const metadata = {
  title: "Timeline — Conflict Catalogue",
  description: "Browse documented incidents chronologically across international conflicts.",
};

export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const search = params.search || "";
  const conflictSlug = params.conflict || "";
  const tagSlug = params.tag || "";
  const dateFrom = params.date_from || "";
  const dateTo = params.date_to || "";

  const supabase = createServerClient();

  // Build the query
  let query = supabase
    .from("incidents")
    .select(
      `
      id, title, slug, date, date_precision, summary, location, killed, injured,
      conflict:conflicts!inner(name, slug),
      perpetrator:entities!incidents_perpetrator_id_fkey(name),
      tags:tags!incident_tags(id, name, slug),
      images(file_path, caption, display_order)
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("date", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  // Apply filters
  if (search) {
    query = query.textSearch("search_vector", search, { type: "websearch" });
  }
  if (conflictSlug) {
    query = query.eq("conflict.slug", conflictSlug);
  }
  if (dateFrom) {
    query = query.gte("date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("date", dateTo);
  }

  const { data: rawEntries, count } = await query;

  // If filtering by tag, we need to filter after fetch since it's a many-to-many
  let entries: TimelineEntry[] = (rawEntries || []).map((row: any) => {
    const sortedImages = (row.images || []).sort(
      (a: any, b: any) => a.display_order - b.display_order
    );
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      date: row.date,
      date_precision: row.date_precision,
      summary: row.summary,
      location: row.location,
      killed: row.killed,
      injured: row.injured,
      conflict: row.conflict,
      perpetrator: row.perpetrator,
      tags: row.tags || [],
      thumbnail: sortedImages.length > 0 ? sortedImages[0] : null,
    };
  });

  if (tagSlug) {
    entries = entries.filter((e) => e.tags.some((t) => t.slug === tagSlug));
  }

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE);

  // Fetch filter options
  const [{ data: conflicts }, { data: tags }] = await Promise.all([
    supabase.from("conflicts").select("name, slug").order("name"),
    supabase.from("tags").select("id, name, slug").order("name"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Timeline
      </h1>

      <TimelineFilters
        conflicts={conflicts || []}
        tags={(tags as Tag[]) || []}
        currentSearch={search}
        currentConflict={conflictSlug}
        currentTag={tagSlug}
        currentDateFrom={dateFrom}
        currentDateTo={dateTo}
      />

      <div className="mt-8">
        <TimelineList entries={entries} page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
