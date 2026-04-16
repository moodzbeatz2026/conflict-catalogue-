import type { Source } from "@/lib/types";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  news: "News",
  un_report: "UN Report",
  ngo_report: "NGO Report",
  legal_filing: "Legal Filing",
  primary_source: "Primary Source",
  other: "Other",
};

export function SourcesList({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  const sorted = [...sources].sort(
    (a, b) => a.display_order - b.display_order
  );

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Sources</h2>
      <ol className="space-y-3">
        {sorted.map((source, index) => (
          <li
            key={source.id}
            id={`source-${index + 1}`}
            className="text-sm text-gray-700 scroll-mt-24"
          >
            <span className="font-semibold text-gray-500 mr-2">
              [{index + 1}]
            </span>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline font-medium"
            >
              {source.title}
            </a>
            <span className="text-gray-500">
              {" "}
              &mdash; {source.publication}
              {source.author && `, ${source.author}`}
              {source.date_published && (
                <>
                  {" "}
                  (
                  {new Date(source.date_published + "T00:00:00").toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                  )
                </>
              )}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {SOURCE_TYPE_LABELS[source.source_type] || source.source_type}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
