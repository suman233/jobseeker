"use client";

import React from "react";
import { JobItem, JobFilterState } from "@/typescript/interface/job.interface";
import JobCard from "./JobCard";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";

interface JobListFeedProps {
  jobs: JobItem[];
  totalCount: number;
  selectedJobId: number | string;
  savedJobIds: Set<number | string>;
  sortBy: JobFilterState["sortBy"];
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onSelectJob: (id: number | string) => void;
  onToggleSave: (id: number | string, e: React.MouseEvent) => void;
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
  isLoading = false,
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
          {isLoading ? (
            <Skeleton variant="text" width={180} height={26} animation="wave" />
          ) : (
            <p className="text-base font-bold text-gray-900 leading-tight">
              {totalCount} Opportunities Found
            </p>
          )}
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
        {isLoading ? (
          // MUI Skeleton Loaders (5 Job Card Skeletons)
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="bg-white rounded-xl p-4 border border-gray-200/80 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 w-full">
                  <Skeleton
                    variant="rounded"
                    width={44}
                    height={44}
                    animation="wave"
                    sx={{ borderRadius: "8px", flexShrink: 0 }}
                  />
                  <div className="w-full space-y-1.5">
                    <Skeleton
                      variant="text"
                      width="35%"
                      height={16}
                      animation="wave"
                    />
                    <Skeleton
                      variant="text"
                      width="75%"
                      height={20}
                      animation="wave"
                    />
                  </div>
                </div>
                <Skeleton
                  variant="circular"
                  width={22}
                  height={22}
                  animation="wave"
                  sx={{ flexShrink: 0 }}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Skeleton
                  variant="rounded"
                  width={80}
                  height={20}
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
                <Skeleton
                  variant="rounded"
                  width={90}
                  height={20}
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
                <Skeleton
                  variant="rounded"
                  width={60}
                  height={20}
                  animation="wave"
                  sx={{ borderRadius: "4px" }}
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <Skeleton
                  variant="text"
                  width={110}
                  height={22}
                  animation="wave"
                />
                <Skeleton
                  variant="rounded"
                  width={85}
                  height={26}
                  animation="wave"
                  sx={{ borderRadius: "6px" }}
                />
              </div>
            </div>
          ))
        ) : jobs.length === 0 ? (
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
      {!isLoading && jobs.length > 0 && (
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
