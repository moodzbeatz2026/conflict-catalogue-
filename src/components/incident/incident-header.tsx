import type { IncidentWithRelations } from "@/lib/types";

function formatDate(date: string, precision: string): string {
  const d = new Date(date + "T00:00:00");
  if (precision === "month") {
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }
  if (precision === "approximate") {
    return `c. ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function IncidentHeader({
  incident,
}: {
  incident: IncidentWithRelations;
}) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
        <time dateTime={incident.date}>
          {formatDate(incident.date, incident.date_precision)}
        </time>
        <span className="text-gray-300">|</span>
        <span>{incident.location}</span>
        <span className="text-gray-300">|</span>
        <span className="font-medium text-gray-700">
          {incident.conflict.name}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        {incident.title}
      </h1>
      <p className="mt-4 text-lg text-gray-600 leading-relaxed">
        {incident.summary}
      </p>
    </div>
  );
}
