"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Opportunity } from "@/data/opportunities";

/** Sentinel value meaning "no filter applied" in a select. */
const ALL = "all";

function isFilterSet(value: string) {
  return value !== ALL;
}

type OpportunitiesBrowserProps = {
  opportunities: Opportunity[];
  categories: string[];
  cities: string[];
};

/**
 * Interactive search + filter UI for the opportunities listing.
 * The page itself stays a server component; only this part needs state.
 */
export function OpportunitiesBrowser({
  opportunities,
  categories,
  cities,
}: OpportunitiesBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [city, setCity] = useState(ALL);

  const filtered = useMemo(
    () =>
      opportunities.filter((opportunity) => {
        const searchTerm = query.trim().toLowerCase();
        const matchesSearch =
          searchTerm === "" ||
          opportunity.title.toLowerCase().includes(searchTerm) ||
          opportunity.organization.toLowerCase().includes(searchTerm) ||
          opportunity.location.toLowerCase().includes(searchTerm);
        const matchesCategory = !isFilterSet(category) || opportunity.category === category;
        const matchesCity = !isFilterSet(city) || opportunity.city === city;
        return matchesSearch && matchesCategory && matchesCity;
      }),
    [opportunities, query, category, city]
  );

  const hasFilters = query.trim() !== "" || isFilterSet(category) || isFilterSet(city);

  function clearFilters() {
    setQuery("");
    setCategory(ALL);
    setCity(ALL);
  }

  return (
    <div className="mt-10">
      {/* Search and filters */}
      <div
        role="search"
        aria-label="Search and filter opportunities"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto_auto]"
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="opportunity-search" className="text-sm font-medium">
            Search
          </label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="opportunity-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search opportunities, organizations, or locations"
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-category" className="text-sm font-medium">
            Category
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(String(value ?? ALL))}
          >
            <SelectTrigger id="filter-category" className="w-full sm:w-44">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((categoryName) => (
                <SelectItem key={categoryName} value={categoryName}>
                  {categoryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-city" className="text-sm font-medium">
            Location
          </label>
          <Select value={city} onValueChange={(value) => setCity(String(value ?? ALL))}>
            <SelectTrigger id="filter-city" className="w-full sm:w-44">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All locations</SelectItem>
              {cities.map((cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={clearFilters}
            variant="outline"
            disabled={!hasFilters}
            aria-disabled={!hasFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{filtered.length}</span> of{" "}
        {opportunities.length} opportunities
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed bg-card p-10 text-center">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            No opportunities match your search yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Try fewer words in the search box, or reset the category and location filters
            to see everything that is running right now.
          </p>
          <Button onClick={clearFilters} variant="outline" className="mt-6">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
