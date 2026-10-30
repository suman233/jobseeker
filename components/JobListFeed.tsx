"use client";

import React from "react";
import { JobItem, JobFilterState } from "@/typescript/interface/job.interface";
import JobCard from "./JobCard";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";

interface JobListFeedProps {
  jobs: JobItem[];
  totalCount: number;
  selectedJobId: number;
  savedJobIds: Set<number>;
  sortBy: JobFilterState["sortBy"];
  currentPage: number;
  totalPages: number;
  onSelectJob: (id: number) => void;
  onToggleSave: (id: number, e: React.MouseEvent) => void;
  onQuickApply: (job: JobItem, e: React.MouseEvent) => void;
  onSortChange: (sort: JobFilterState["sortBy"]) => void;
  onPageChange: (page: number) => void;
}

export const JobListFeed: React.FC<JobListFeedProps> = ({
  jobs,
  totalCount,
  selectedJobId,
  savedJobIds,
  sortBy,
  currentPage,
  totalPages,
  onSelectJob,
  onToggleSave,
  onQuickApply,
  onSortChange,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Column Header & Sorter Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <p className="text-base font-bold text-gray-900 leading-tight">
            {totalCount} Opportunities Found
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Ranked by relevancy & market trajectory
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <label
            htmlFor="sortBy"
            className="text-[11px] text-gray-500 font-bold uppercase tracking-wider"
          >
            Sort:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as JobFilterState["sortBy"])
            }
            className="bg-white border border-gray-200 text-xs font-semibold text-gray-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="recent">Most Recent</option>
            <option value="relevancy">Highest Match</option>
            <option value="comp">Compensation</option>
            <option value="urgent">Urgent Hiring</option>
          </select>
        </div>
      </div>

      {/* Job Cards List Stack */}
      <div className="flex flex-col gap-3" id="jobsListContainer">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-2xs">
            <SearchX size={36} className="text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">
              No matching opportunities found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your role keywords or filters to see more listings.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={job.id === selectedJobId}
              isSaved={savedJobIds.has(job.id)}
              onSelect={onSelectJob}
              onToggleSave={onToggleSave}
              onQuickApply={onQuickApply}
            />
          ))
        )}
      </div>

      {/* Bottom Pagination */}
      {jobs.length > 0 && (
        <div className="flex items-center justify-between pt-2 pb-6 text-xs text-gray-500">
          <span>
            Showing 1-{jobs.length} of {totalCount} positions
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous Page"
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next Page"
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListFeed;
