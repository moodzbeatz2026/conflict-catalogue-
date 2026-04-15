import Link from "next/link";
import Image from "next/image";
import type { TimelineEntry } from "@/lib/types";

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

export function TimelineEntryCard({ entry }: { entry: TimelineEntry }) {
  const imageUrl = entry.thumbnail
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/incident-images/${entry.thumbnail.file_path}`
    : null;

  return (
    <Link
      href={`/incidents/${entry.slug}`}
      className="group block border-b border-gray-100 py-6 first:pt-0 last:border-b-0"
    >
      <div className="flex gap-6">
        {imageUrl && (
          <div className="hidden sm:block flex-shrink-0 w-40 h-28 relative rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt={entry.thumbnail?.caption || entry.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="160px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-1">
            <time dateTime={entry.date}>
              {formatDate(entry.date, entry.date_precision)}
            </time>
            <span className="text-gray-300">|</span>
            <span>{entry.conflict.name}</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
            {entry.title}
          </h2>
          <p className="mt-1 text-gray-600 text-sm line-clamp-2">
            {entry.summary}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
              >
                {tag.name}
              </span>
            ))}
            {(entry.killed !== null || entry.injured !== null) && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                {entry.killed !== null && `${entry.killed} killed`}
                {entry.killed !== null && entry.injured !== null && ", "}
                {entry.injured !== null && `${entry.injured} injured`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
