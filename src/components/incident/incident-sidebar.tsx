import Link from "next/link";
import type { IncidentWithRelations } from "@/lib/types";

export function IncidentSidebar({
  incident,
}: {
  incident: IncidentWithRelations;
}) {
  return (
    <aside className="rounded-lg border border-gray-200 p-5 space-y-5">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Conflict
        </h3>
        <Link
          href={`/timeline?conflict=${incident.conflict.slug}`}
          className="text-sm font-medium text-gray-900 hover:text-blue-700"
        >
          {incident.conflict.name}
        </Link>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Perpetrator
        </h3>
        <p className="text-sm font-medium text-gray-900">
          {incident.perpetrator.name}
        </p>
      </div>

      {incident.victims && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Victims
          </h3>
          <p className="text-sm text-gray-700">{incident.victims}</p>
        </div>
      )}

      {(incident.killed !== null || incident.injured !== null) && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Casualties
          </h3>
          <div className="flex gap-4">
            {incident.killed !== null && (
              <div>
                <span className="text-2xl font-bold text-red-700">
                  {incident.killed.toLocaleString()}
                </span>
                <p className="text-xs text-gray-500">Killed</p>
              </div>
            )}
            {incident.injured !== null && (
              <div>
                <span className="text-2xl font-bold text-orange-600">
                  {incident.injured.toLocaleString()}
                </span>
                <p className="text-xs text-gray-500">Injured</p>
              </div>
            )}
          </div>
        </div>
      )}

      {incident.tags.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {incident.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/timeline?tag=${tag.slug}`}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
