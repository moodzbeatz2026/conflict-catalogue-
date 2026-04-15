import Link from "next/link";
import type { TimelineEntry } from "@/lib/types";
import { TimelineEntryCard } from "./timeline-entry";

interface TimelineListProps {
  entries: TimelineEntry[];
  page: number;
  totalPages: number;
}

export function TimelineList({ entries, page, totalPages }: TimelineListProps) {
  if (entries.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <p className="text-lg">No incidents found matching your criteria.</p>
        <p className="mt-2 text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <TimelineEntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`?page=${page - 1}`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`?page=${page + 1}`}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
