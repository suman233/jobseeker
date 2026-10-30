"use client";

import React from "react";
import { JobItem } from "@/typescript/interface/job.interface";

interface JobCardProps {
  job: JobItem;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: (id: number) => void;
  onToggleSave: (id: number, e: React.MouseEvent) => void;
  onQuickApply: (job: JobItem, e: React.MouseEvent) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  isSaved,
  onSelect,
  onToggleSave,
  onQuickApply,
}) => {
  return (
    <article
      onClick={() => onSelect(job.id)}
      className={`job-card cursor-pointer bg-surface-container-lowest rounded-xl p-space-md border relative transition-all duration-200 ${
        isSelected
          ? "shadow-md shadow-surface-dim/40 border-primary-container/30"
          : "shadow-sm hover:shadow-md border-surface-container/60"
      }`}
    >
      {/* Active selection vertical indicator strip */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container rounded-l-xl" />
      )}

      {/* Top Header: Logo, Company & Bookmark */}
      <div className="flex items-start justify-between gap-space-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-surface-container">
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                {job.company}
              </span>
              {job.verified && (
                <span className="material-symbols-outlined text-secondary text-[16px]">
                  verified
                </span>
              )}
            </div>
            <h3
              className={`font-headline-sm text-headline-sm transition-colors ${
                isSelected
                  ? "text-primary font-bold"
                  : "text-on-surface hover:text-primary"
              }`}
            >
              {job.title}
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              {job.department}
            </p>
          </div>
        </div>

        {/* Bookmark save toggle button */}
        <button
          type="button"
          aria-label={isSaved ? "Unsave Job" : "Save Job"}
          onClick={(e) => onToggleSave(job.id, e)}
          className={`transition-colors p-1 rounded-md hover:bg-surface-container ${
            isSaved ? "text-primary" : "text-outline-variant hover:text-primary"
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: `'FILL' ${isSaved ? 1 : 0}` }}
          >
            bookmark
          </span>
        </button>
      </div>

      {/* Metadata Chips Row */}
      <div className="flex flex-wrap items-center gap-space-xs mt-space-md">
        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
          {job.salaryRange}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md">
          {job.location}
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant font-label-md text-label-md">
          {job.level}
        </span>
        <span className="ml-auto font-label-sm text-label-sm text-on-surface-variant">
          {job.postedAt}
        </span>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between mt-space-md pt-space-sm bg-surface-container-low px-space-sm py-1.5 rounded-lg border border-surface-container/40">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            {job.skillsMatch}% Skills Match
          </span>
        </div>

        {job.statusType === "quickApply" ? (
          <button
            type="button"
            onClick={(e) => onQuickApply(job, e)}
            className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>{" "}
            Quick Apply
          </button>
        ) : job.statusType === "applicants" ? (
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">group</span>{" "}
            {job.applicantsCount} Applicants
          </span>
        ) : job.statusType === "reviewing" ? (
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">
              schedule
            </span>{" "}
            Reviewing Next 48h
          </span>
        ) : (
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Verified Salary Range
          </span>
        )}
      </div>
    </article>
  );
};

export default JobCard;

