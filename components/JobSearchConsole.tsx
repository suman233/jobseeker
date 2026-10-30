"use client";

import React from "react";
import { JobFilterState } from "@/typescript/interface/job.interface";

interface JobSearchConsoleProps {
  filters: JobFilterState;
  onFilterChange: <K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K]
  ) => void;
  onSearchSubmit: () => void;
}

export const JobSearchConsole: React.FC<JobSearchConsoleProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <div className="relative w-full overflow-hidden bg-surface pb-space-xl">
      {/* Interactive Background Glow Elements */}
      <div className="absolute -top-40 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 -left-20 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Search Canvas Container */}
      <div className="max-w-[1280px] mx-auto px-gutter pt-space-lg w-full relative z-10">
        {/* Market Pulse Micro Bar */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md bg-surface-container-low px-space-md py-space-xs rounded-full border border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Live Market Feed
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              3,420 high-growth roles vetted this week
            </span>
          </div>
          <div className="hidden md:flex items-center gap-space-md">
            <span className="font-label-sm text-label-sm text-secondary font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                trending_up
              </span>
              Avg. Staff Comp +14.2% YoY
            </span>
            <span className="text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              San Francisco / NYC / Remote Hubs
            </span>
          </div>
        </div>

        {/* Main Search Console Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-lg shadow-xl shadow-surface-dim/30 border border-surface-container">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-space-sm md:gap-space-md items-center"
          >
            {/* Role / Tech Input */}
            <div className="md:col-span-5 relative flex items-center bg-surface-container-low rounded-lg px-space-md py-2.5 focus-within:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-primary text-[22px] mr-space-sm shrink-0">
                work
              </span>
              <div className="flex flex-col w-full min-w-0">
                <label
                  htmlFor="searchRole"
                  className="font-label-sm text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase"
                >
                  Role or keywords
                </label>
                <input
                  id="searchRole"
                  type="text"
                  value={filters.roleQuery}
                  onChange={(e) => onFilterChange("roleQuery", e.target.value)}
                  placeholder="Design Systems, Staff Engineer, Stripe..."
                  className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none placeholder:text-outline-variant placeholder:font-normal"
                />
              </div>
              {filters.roleQuery && (
                <button
                  type="button"
                  aria-label="Clear role"
                  onClick={() => onFilterChange("roleQuery", "")}
                  className="text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    cancel
                  </span>
                </button>
              )}
            </div>

            {/* Location / Remote Input */}
            <div className="md:col-span-4 relative flex items-center bg-surface-container-low rounded-lg px-space-md py-2.5 focus-within:bg-surface-container transition-all">
              <span className="material-symbols-outlined text-secondary text-[22px] mr-space-sm shrink-0">
                location_on
              </span>
              <div className="flex flex-col w-full min-w-0">
                <label
                  htmlFor="searchLocation"
                  className="font-label-sm text-[10px] text-on-surface-variant font-semibold tracking-wider uppercase"
                >
                  Location
                </label>
                <input
                  id="searchLocation"
                  type="text"
                  value={filters.locationQuery}
                  onChange={(e) =>
                    onFilterChange("locationQuery", e.target.value)
                  }
                  placeholder="Remote, San Francisco, New York..."
                  className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none placeholder:text-outline-variant placeholder:font-normal"
                />
              </div>
              <span className="material-symbols-outlined text-outline-variant text-[18px]">
                near_me
              </span>
            </div>

            {/* Radius / Distance Selector */}
            <div className="md:col-span-1 relative flex items-center bg-surface-container-low rounded-lg px-space-sm py-2.5 h-full">
              <div className="flex flex-col w-full">
                <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold uppercase">
                  Radius
                </span>
                <select
                  value={filters.radius}
                  onChange={(e) => onFilterChange("radius", e.target.value)}
                  className="bg-transparent font-body-sm text-body-sm text-on-surface focus:outline-none cursor-pointer"
                >
                  <option value="Exact">Exact</option>
                  <option value="+25 mi">+25 mi</option>
                  <option value="+50 mi">+50 mi</option>
                  <option value="Anywhere">Anywhere</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-[52px] bg-primary-container text-on-primary rounded-lg font-headline-sm text-headline-sm flex items-center justify-center gap-space-sm shadow-md shadow-primary/25 hover:bg-primary active:scale-[0.99] transition-all cursor-pointer font-semibold"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                <span>Find Roles</span>
              </button>
            </div>
          </form>

          {/* Quick Pill Filters Bar */}
          <div className="flex items-center gap-space-xs flex-wrap mt-space-md pt-space-sm border-t border-surface-container/60">
            <span className="font-label-sm text-label-sm text-on-surface-variant mr-space-xs uppercase tracking-wider font-semibold">
              Fast Filters:
            </span>

            {/* Remote Only Pill */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("remoteOnly", !filters.remoteOnly)
              }
              className={`group flex items-center gap-1.5 px-space-md py-1 rounded-full font-body-sm text-body-sm transition-all ${
                filters.remoteOnly
                  ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                  : "bg-surface-container text-on-surface hover:bg-surface-container-high"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  filters.remoteOnly ? "bg-primary" : "bg-secondary"
                }`}
              ></span>
              <span className="font-medium">Remote Only</span>
              <span
                className={`material-symbols-outlined text-[14px] ${
                  filters.remoteOnly ? "text-primary" : "text-outline"
                }`}
              >
                check
              </span>
            </button>

            {/* Full-time Pill */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("fullTimeOnly", !filters.fullTimeOnly)
              }
              className={`group flex items-center gap-1.5 px-space-md py-1 rounded-full font-body-sm text-body-sm transition-all ${
                filters.fullTimeOnly
                  ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              <span>Full-time</span>
            </button>

            {/* $150k+ Pill */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("minSalary150k", !filters.minSalary150k)
              }
              className={`group flex items-center gap-1.5 px-space-md py-1 rounded-full font-body-sm text-body-sm shadow-sm transition-all ${
                filters.minSalary150k
                  ? "bg-secondary-fixed text-on-secondary-fixed font-semibold"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                payments
              </span>
              <span className="font-medium">$150k+</span>
              {filters.minSalary150k && (
                <span className="material-symbols-outlined text-[14px]">
                  close
                </span>
              )}
            </button>

            {/* Product & Engineering Pill */}
            <button
              type="button"
              onClick={() =>
                onFilterChange(
                  "category",
                  filters.category === "Product & Engineering"
                    ? "All"
                    : "Product & Engineering"
                )
              }
              className={`group flex items-center gap-1.5 px-space-md py-1 rounded-full font-body-sm text-body-sm transition-all ${
                filters.category === "Product & Engineering"
                  ? "bg-primary-fixed text-on-primary-fixed font-semibold"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              <span>Product & Engineering</span>
            </button>

            {/* Easy Apply Pill */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("easyApplyOnly", !filters.easyApplyOnly)
              }
              className={`group flex items-center gap-1.5 px-space-md py-1 rounded-full font-body-sm text-body-sm font-semibold transition-all ${
                filters.easyApplyOnly
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-primary hover:bg-primary hover:text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Easy Apply</span>
            </button>

            {/* More Filters Pill */}
            <button
              type="button"
              className="group flex items-center gap-1.5 px-space-md py-1 rounded-full bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">tune</span>
              <span>More Filters (6)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchConsole;

