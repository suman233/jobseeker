"use client";

import React from "react";
import { JobItem } from "@/typescript/interface/job.interface";
import { CheckCircle2, Bookmark, Zap, Users, Clock } from "lucide-react";
import { mediaUrl } from "@/utils/media";

interface JobCardProps {
  job: JobItem;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: (id: number | string) => void;
  onToggleSave: (id: number | string, e: React.MouseEvent) => void;
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
      className={`cursor-pointer bg-white rounded-xl p-4 border relative transition-all duration-150 select-none ${
        isSelected
          ? "border-indigo-600 shadow-sm ring-1 ring-indigo-600/30"
          : "border-gray-200/80 hover:border-gray-300 hover:shadow-xs"
      }`}
    >
      {/* Left indicator strip when active */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl" />
      )}

      {/* Top Header: Logo, Company & Bookmark */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 p-1">
            <img
              src={mediaUrl(job.companyLogo, "job")}
              alt={`${job.company} logo`}
              className="w-9 h-9 object-contain"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80";
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-gray-800">
                {job.company}
              </span>
              {job.verified && (
                <CheckCircle2 size={14} className="text-emerald-600 fill-emerald-50" />
              )}
            </div>
            <h3
              className={`text-sm font-bold tracking-tight truncate mt-0.5 ${
                isSelected ? "text-indigo-600" : "text-gray-900"
              }`}
            >
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {job.department}
            </p>
          </div>
        </div>

        {/* Bookmark Button */}
        <button
          type="button"
          aria-label={isSaved ? "Unsave Job" : "Save Job"}
          onClick={(e) => onToggleSave(job.id, e)}
          className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors shrink-0 cursor-pointer ${
            isSaved ? "text-indigo-600" : "text-gray-400 hover:text-gray-700"
          }`}
        >
          <Bookmark
            size={18}
            className={isSaved ? "fill-indigo-600 text-indigo-600" : ""}
          />
        </button>
      </div>

      {/* Metadata Chips Row */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold">
          {job.salaryRange}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
          {job.workType || job.location}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-[11px] font-medium">
          {job.level}
        </span>
        <span className="ml-auto text-[11px] text-gray-400 font-medium shrink-0">
          {job.postedAt}
        </span>
      </div>

      {/* Card Action Footer */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs text-emerald-700 font-semibold">
            {job.skillsMatch}% Skills Match
          </span>
        </div>

        {job.statusType === "quickApply" ? (
          <button
            type="button"
            onClick={(e) => onQuickApply(job, e)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Zap size={13} className="fill-current" />
            <span>Quick Apply</span>
          </button>
        ) : job.statusType === "applicants" ? (
          <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
            <Users size={13} />
            <span>{job.applicantsCount || 12} Applicants</span>
          </span>
        ) : job.statusType === "reviewing" ? (
          <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
            <Clock size={13} />
            <span>Reviewing Next 48h</span>
          </span>
        ) : (
          <span className="text-xs text-gray-500 font-medium">
            Verified Salary Range
          </span>
        )}
      </div>
    </article>
  );
};

export default JobCard;
