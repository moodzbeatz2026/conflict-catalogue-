import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineFilters } from "@/components/timeline/timeline-filters";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/timeline",
}));

const mockConflicts = [
  { name: "Israel-Palestine", slug: "israel-palestine" },
  { name: "Israel-Lebanon", slug: "israel-lebanon" },
];

const mockTags = [
  { id: "1", name: "hospital", slug: "hospital" },
  { id: "2", name: "school", slug: "school" },
];

describe("TimelineFilters", () => {
  it("renders a search input", () => {
    render(
      <TimelineFilters
        conflicts={mockConflicts}
        tags={mockTags}
        currentSearch=""
        currentConflict=""
        currentTag=""
        currentDateFrom=""
        currentDateTo=""
      />
    );
    expect(screen.getByPlaceholderText(/search/i)).toBeDefined();
  });

  it("renders conflict filter options", () => {
    render(
      <TimelineFilters
        conflicts={mockConflicts}
        tags={mockTags}
        currentSearch=""
        currentConflict=""
        currentTag=""
        currentDateFrom=""
        currentDateTo=""
      />
    );
    expect(screen.getByText("Israel-Palestine")).toBeDefined();
    expect(screen.getByText("Israel-Lebanon")).toBeDefined();
  });

  it("shows active filter chips when filters are applied", () => {
    render(
      <TimelineFilters
        conflicts={mockConflicts}
        tags={mockTags}
        currentSearch="hospital"
        currentConflict="israel-palestine"
        currentTag=""
        currentDateFrom=""
        currentDateTo=""
      />
    );
    expect(screen.getByText(/hospital/)).toBeDefined();
    expect(screen.getByText(/Israel-Palestine/)).toBeDefined();
  });
});
