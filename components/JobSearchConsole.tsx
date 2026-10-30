"use client";

import React from "react";
import { JobFilterState } from "@/typescript/interface/job.interface";
import {
  Briefcase,
  MapPin,
  Crosshair,
  Search,
  X,
  TrendingUp,
  Check,
  DollarSign,
  Zap,
  SlidersHorizontal,
} from "lucide-react";

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
    <div className="relative w-full bg-slate-50/50 pb-8 pt-4">
      <div className="max-w-[1280px] mx-auto px-4 w-full">
        {/* Live Market Feed Micro Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 px-3 py-1.5 rounded-full text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold tracking-wider text-gray-600 uppercase text-[11px]">
              Live Market Feed
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 font-medium">
              3,420 high-growth roles vetted this week
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-600" />
              Avg. Staff Comp +14.2% YoY
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">
              San Francisco / NYC / Remote Hubs
            </span>
          </div>
        </div>

        {/* Search Console Card */}
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-200/80">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch"
          >
            {/* Role / Keywords Input */}
            <div className="md:col-span-5 relative flex items-center bg-gray-50/90 rounded-xl px-3.5 py-2 border border-gray-200/70 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <Briefcase size={20} className="text-indigo-600 mr-3 shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <label
                  htmlFor="searchRole"
                  className="text-[10px] text-gray-500 font-bold uppercase tracking-wider"
                >
                  Role or Keywords
                </label>
                <input
                  id="searchRole"
                  type="text"
                  value={filters.roleQuery}
                  onChange={(e) => onFilterChange("roleQuery", e.target.value)}
                  placeholder="Senior Product Designer, Staff Engineer..."
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder:text-gray-400 placeholder:font-normal py-0.5"
                />
              </div>
              {filters.roleQuery && (
                <button
                  type="button"
                  aria-label="Clear role"
                  onClick={() => onFilterChange("roleQuery", "")}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Location Input */}
            <div className="md:col-span-4 relative flex items-center bg-gray-50/90 rounded-xl px-3.5 py-2 border border-gray-200/70 focus-within:border-indigo-500 focus-within:bg-white transition-all">
              <MapPin size={20} className="text-emerald-600 mr-3 shrink-0" />
              <div className="flex flex-col w-full min-w-0">
                <label
                  htmlFor="searchLocation"
                  className="text-[10px] text-gray-500 font-bold uppercase tracking-wider"
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
                  placeholder="San Francisco, CA or Remote"
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder:text-gray-400 placeholder:font-normal py-0.5"
                />
              </div>
              <Crosshair size={16} className="text-gray-400 shrink-0 ml-1" />
            </div>

            {/* Radius Selector */}
            <div className="md:col-span-1 relative flex items-center bg-gray-50/90 rounded-xl px-3 py-2 border border-gray-200/70">
              <div className="flex flex-col w-full">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                  Radius
                </span>
                <select
                  value={filters.radius}
                  onChange={(e) => onFilterChange("radius", e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer py-1"
                >
                  <option value="Exact">Exact</option>
                  <option value="+25 mi">+25 mi</option>
                  <option value="+50 mi">+50 mi</option>
                  <option value="Anywhere">Anywhere</option>
                </select>
              </div>
            </div>

            {/* Find Roles Submit Button */}
            <div className="md:col-span-2 flex items-stretch">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Search size={18} className="stroke-[2.5]" />
                <span>Find Roles</span>
              </button>
            </div>
          </form>

          {/* Fast Filters Pills Row */}
          <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mr-1">
              Fast Filters:
            </span>

            {/* Remote Only */}
            <button
              type="button"
              onClick={() => onFilterChange("remoteOnly", !filters.remoteOnly)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                filters.remoteOnly
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  filters.remoteOnly ? "bg-indigo-600" : "bg-emerald-500"
                }`}
              ></span>
              <span>Remote Only</span>
              <Check
                size={13}
                className={filters.remoteOnly ? "text-indigo-600" : "text-gray-400"}
              />
            </button>

            {/* Full-time */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("fullTimeOnly", !filters.fullTimeOnly)
              }
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                filters.fullTimeOnly
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>Full-time</span>
            </button>

            {/* $150k+ Pill (Highlight green as in design) */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("minSalary150k", !filters.minSalary150k)
              }
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                filters.minSalary150k
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800 shadow-2xs"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <DollarSign size={13} className="text-emerald-700 -mr-0.5" />
              <span>$150k+</span>
              {filters.minSalary150k && (
                <X size={13} className="text-emerald-700 ml-0.5 hover:opacity-75" />
              )}
            </button>

            {/* Product & Engineering */}
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
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                filters.category === "Product & Engineering"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>Product & Engineering</span>
            </button>

            {/* Easy Apply */}
            <button
              type="button"
              onClick={() =>
                onFilterChange("easyApplyOnly", !filters.easyApplyOnly)
              }
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                filters.easyApplyOnly
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <Zap size={13} className="fill-current" />
              <span>Easy Apply</span>
            </button>

            {/* More Filters */}
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} className="text-gray-500" />
              <span>More Filters (6)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchConsole;
