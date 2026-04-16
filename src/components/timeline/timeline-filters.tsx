"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { Tag } from "@/lib/types";

interface TimelineFiltersProps {
  conflicts: { name: string; slug: string }[];
  tags: Tag[];
  currentSearch: string;
  currentConflict: string;
  currentTag: string;
  currentDateFrom: string;
  currentDateTo: string;
}

export function TimelineFilters({
  conflicts,
  tags,
  currentSearch,
  currentConflict,
  currentTag,
  currentDateFrom,
  currentDateTo,
}: TimelineFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilter = useCallback(
    (key: string) => {
      updateFilter(key, "");
    },
    [updateFilter]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasActiveFilters =
    currentSearch || currentConflict || currentTag || currentDateFrom || currentDateTo;

  const activeConflict = conflicts.find((c) => c.slug === currentConflict);
  const activeTag = tags.find((t) => t.slug === currentTag);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search incidents..."
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateFilter("search", e.currentTarget.value);
              }
            }}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>

        <select
          value={currentTag}
          onChange={(e) => updateFilter("tag", e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
        >
          <option value="">All categories</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug} label={t.name} />
          ))}
        </select>
      </div>

      {conflicts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {conflicts
            .filter((c) => c.slug !== currentConflict)
            .map((c) => (
              <button
                key={c.slug}
                onClick={() => updateFilter("conflict", c.slug)}
                className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-500 hover:text-gray-800"
              >
                {c.name}
              </button>
            ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">From:</label>
          <input
            type="date"
            value={currentDateFrom}
            onChange={(e) => updateFilter("date_from", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">To:</label>
          <input
            type="date"
            value={currentDateTo}
            onChange={(e) => updateFilter("date_to", e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500">Active filters:</span>
          {currentSearch && (
            <button
              onClick={() => clearFilter("search")}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              &ldquo;{currentSearch}&rdquo;
              <span aria-label="Remove filter">&times;</span>
            </button>
          )}
          {currentConflict && (
            <button
              onClick={() => clearFilter("conflict")}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {activeConflict?.name || currentConflict}
              <span aria-label="Remove filter">&times;</span>
            </button>
          )}
          {currentTag && (
            <button
              onClick={() => clearFilter("tag")}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {activeTag?.name || currentTag}
              <span aria-label="Remove filter">&times;</span>
            </button>
          )}
          {(currentDateFrom || currentDateTo) && (
            <button
              onClick={() => {
                clearFilter("date_from");
                clearFilter("date_to");
              }}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {currentDateFrom || "..."} &ndash; {currentDateTo || "..."}
              <span aria-label="Remove filter">&times;</span>
            </button>
          )}
          <button
            onClick={clearAll}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
