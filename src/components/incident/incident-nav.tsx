import Link from "next/link";

interface IncidentNavProps {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

export function IncidentNav({ previous, next }: IncidentNavProps) {
  if (!previous && !next) return null;

  return (
    <nav className="mt-12 border-t border-gray-200 pt-8 flex justify-between gap-4">
      {previous ? (
        <Link
          href={`/incidents/${previous.slug}`}
          className="group flex-1 text-left"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 group-hover:text-gray-700">
            &larr; Previous
          </span>
          <p className="mt-1 text-sm font-medium text-gray-900 group-hover:text-blue-700 line-clamp-1">
            {previous.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/incidents/${next.slug}`}
          className="group flex-1 text-right"
        >
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500 group-hover:text-gray-700">
            Next &rarr;
          </span>
          <p className="mt-1 text-sm font-medium text-gray-900 group-hover:text-blue-700 line-clamp-1">
            {next.title}
          </p>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
