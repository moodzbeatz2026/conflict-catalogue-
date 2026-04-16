import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { IncidentHeader } from "@/components/incident/incident-header";
import { ImageGallery } from "@/components/incident/image-gallery";
import { IncidentBody } from "@/components/incident/incident-body";
import { IncidentSidebar } from "@/components/incident/incident-sidebar";
import { SourcesList } from "@/components/incident/sources-list";
import { IncidentNav } from "@/components/incident/incident-nav";
import type { IncidentWithRelations } from "@/lib/types";

export const dynamic = "force-dynamic";

interface IncidentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: IncidentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: incident } = await supabase
    .from("incidents")
    .select("title, summary")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!incident) return { title: "Not Found" };

  return {
    title: `${incident.title} — Conflict Catalogue`,
    description: incident.summary,
  };
}

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  // Fetch the incident with all relations
  const { data: incident, error } = await supabase
    .from("incidents")
    .select(
      `
      *,
      conflict:conflicts(*),
      perpetrator:entities!incidents_perpetrator_id_fkey(*),
      sources(*),
      images(*),
      tags:tags!incident_tags(*),
      affected_entities:entities!incident_affected_entities(*)
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Supabase query error:", error);
  }

  if (!incident) notFound();

  const typedIncident = incident as unknown as IncidentWithRelations;

  // Fetch previous and next incidents for navigation
  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from("incidents")
      .select("slug, title")
      .eq("status", "published")
      .gt("date", incident.date)
      .order("date", { ascending: true })
      .limit(1)
      .single(),
    supabase
      .from("incidents")
      .select("slug, title")
      .eq("status", "published")
      .lt("date", incident.date)
      .order("date", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <IncidentHeader incident={typedIncident} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <ImageGallery images={typedIncident.images} />
          <IncidentBody body={typedIncident.body} />
          <SourcesList sources={typedIncident.sources} />
          <IncidentNav
            previous={prevData ? { slug: prevData.slug, title: prevData.title } : null}
            next={nextData ? { slug: nextData.slug, title: nextData.title } : null}
          />
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <IncidentSidebar incident={typedIncident} />
        </div>
      </div>
    </article>
  );
}
