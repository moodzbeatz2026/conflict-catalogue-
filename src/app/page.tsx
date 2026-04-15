import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Conflict Catalogue
      </h1>
      <p className="mt-6 text-xl leading-8 text-gray-600">
        A documented record of incidents and crimes committed by states and
        entities across international conflicts. Every entry is sourced from
        publicly available reports, news articles, and official documentation.
      </p>
      <p className="mt-4 text-lg leading-7 text-gray-500">
        Browse the timeline to explore documented incidents chronologically.
        Search by keyword, filter by conflict, or explore by category.
      </p>
      <div className="mt-10">
        <Link
          href="/timeline"
          className="inline-flex items-center rounded-md bg-gray-900 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700 transition-colors"
        >
          Explore the Timeline
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
