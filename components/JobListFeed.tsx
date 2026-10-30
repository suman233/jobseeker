"use client";

import React from "react";
import { JobItem, JobFilterState } from "@/typescript/interface/job.interface";
import JobCard from "./JobCard";

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
    <div className="flex flex-col gap-space-md">
      {/* Column Header & Sorter Controls */}
      <div className="flex items-center justify-between pb-space-xs bg-surface border-b border-surface-container/60">
        <div>
          <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
            {totalCount} Opportunities Found
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Ranked by relevancy & market trajectory
          </p>
        </div>
        <div className="flex items-center gap-space-xs">
          <label
            htmlFor="sortBy"
            className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold"
          >
            Sort:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as JobFilterState["sortBy"])
            }
            className="bg-surface-container-low font-body-sm text-body-sm text-on-surface rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer border border-surface-container"
          >
            <option value="relevancy">Highest Match</option>
            <option value="recent">Most Recent</option>
            <option value="comp">Compensation (High to Low)</option>
            <option value="urgent">Urgent Hiring</option>
          </select>
        </div>
      </div>

      {/* Job Cards List Stack */}
      <div className="flex flex-col gap-space-sm" id="jobsListContainer">
        {jobs.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center border border-surface-container">
            <span className="material-symbols-outlined text-[36px] text-outline mb-2">
              search_off
            </span>
            <p className="font-headline-sm text-on-surface font-medium">
              No matching opportunities found
            </p>
            <p className="font-body-sm text-on-surface-variant mt-1">
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
        <div className="flex items-center justify-between pt-space-sm pb-space-lg">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing 1-{jobs.length} of {totalCount} positions
          </span>
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous Page"
              className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-9 h-9 rounded-lg font-headline-sm text-headline-sm flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-primary-container text-on-primary shadow-sm"
                      : "bg-surface-container-low hover:bg-surface-container text-on-surface"
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
              className="w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListFeed;

