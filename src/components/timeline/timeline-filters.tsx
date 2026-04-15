"use client";

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

export function TimelineFilters(props: TimelineFiltersProps) {
  return <div>Filters placeholder — will be implemented in Task 8</div>;
}
