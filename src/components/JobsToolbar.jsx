import { Filter, Heart, RotateCcw } from "lucide-react";

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      <select
        value={value}
        onChange={onChange}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ActiveFilterChip({ label }) {
  return <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">{label}</span>;
}

function JobsToolbar({ filters, onFilterChange, onClearFilters, filterOptions, savedCount, resultsCount }) {
  const activeChips = [
    filters.search ? `Search: ${filters.search}` : null,
    filters.location !== "all" ? `Location: ${filters.location}` : null,
    filters.experienceLevel !== "all" ? `Level: ${filters.experienceLevel}` : null,
    filters.category !== "all" ? `Category: ${filters.category}` : null,
    filters.type !== "all" ? `Type: ${filters.type}` : null,
    filters.minMatch > 0 ? `Min match: ${filters.minMatch}%` : null,
    filters.savedOnly ? "Saved only" : null,
    filters.sortBy === "lowest" ? "Sort: Lowest match" : filters.sortBy === "newest" ? "Sort: Newest" : "Sort: Highest match",
  ].filter(Boolean);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4" />
            Results Controls
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {resultsCount} job{resultsCount === 1 ? "" : "s"} after sorting and filters.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
          <Heart className="h-4 w-4" />
          {savedCount} saved
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-7">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700 xl:col-span-2">
          Search
          <input
            type="text"
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Search title, company, or skills"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <SelectField
          label="Sort"
          value={filters.sortBy}
          onChange={(event) => onFilterChange("sortBy", event.target.value)}
          options={[
            { value: "highest", label: "Highest match" },
            { value: "lowest", label: "Lowest match" },
            { value: "newest", label: "Newest" },
          ]}
        />
        <SelectField
          label="Location"
          value={filters.location}
          onChange={(event) => onFilterChange("location", event.target.value)}
          options={filterOptions.locations}
        />
        <SelectField
          label="Level"
          value={filters.experienceLevel}
          onChange={(event) => onFilterChange("experienceLevel", event.target.value)}
          options={filterOptions.levels}
        />
        <SelectField
          label="Category"
          value={filters.category}
          onChange={(event) => onFilterChange("category", event.target.value)}
          options={filterOptions.categories}
        />
        <SelectField
          label="Type"
          value={filters.type}
          onChange={(event) => onFilterChange("type", event.target.value)}
          options={filterOptions.types}
        />
        <SelectField
          label="Minimum Match"
          value={String(filters.minMatch)}
          onChange={(event) => onFilterChange("minMatch", Number(event.target.value))}
          options={[
            { value: "0", label: "Any match" },
            { value: "40", label: "40%+" },
            { value: "60", label: "60%+" },
            { value: "80", label: "80%+" },
          ]}
        />

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700">Saved only</label>
          <button
            type="button"
            onClick={() => onFilterChange("savedOnly", !filters.savedOnly)}
            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
              filters.savedOnly
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {filters.savedOnly ? "Showing saved jobs" : "All jobs"}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {activeChips.map((chip) => (
          <ActiveFilterChip key={chip} label={chip} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4" />
          Clear Filters
        </button>
      </div>
    </section>
  );
}

export default JobsToolbar;
