"use client";

import React, { useState } from "react";
import { JobItem } from "@/typescript/interface/job.interface";
import {
  CheckCircle2,
  MapPin,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Zap,
} from "lucide-react";
import Skeleton from "@mui/material/Skeleton";
import { mediaUrl } from "@/utils/media";

interface JobDetailPaneProps {
  job: JobItem | null;
  isSaved: boolean;
  isLoading?: boolean;
  onToggleSave: (id: number | string, e: React.MouseEvent) => void;
  onApplyClick: (job: JobItem) => void;
  onShareClick?: (job: JobItem) => void;
}

export const JobDetailPane: React.FC<JobDetailPaneProps> = ({
  job,
  isSaved,
  isLoading = false,
  onToggleSave,
  onApplyClick,
  onShareClick,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "team" | "benefits" | "interview"
  >("overview");

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 w-full">
            <Skeleton
              variant="rounded"
              width={56}
              height={56}
              animation="wave"
              sx={{ borderRadius: "12px", flexShrink: 0 }}
            />
            <div className="space-y-2 w-full">
              <Skeleton variant="text" width="40%" height={22} animation="wave" />
              <Skeleton variant="text" width="80%" height={32} animation="wave" />
              <Skeleton variant="text" width="60%" height={18} animation="wave" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton variant="rounded" width={36} height={36} animation="wave" sx={{ borderRadius: "8px" }} />
            <Skeleton variant="rounded" width={36} height={36} animation="wave" sx={{ borderRadius: "8px" }} />
          </div>
        </div>

        <div className="bg-gray-50/80 rounded-xl p-4 space-y-2 border border-gray-100">
          <Skeleton variant="text" width={180} height={18} animation="wave" />
          <Skeleton variant="text" width={260} height={36} animation="wave" />
          <div className="pt-2">
            <Skeleton variant="rounded" width={140} height={38} animation="wave" sx={{ borderRadius: "8px" }} />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Skeleton variant="text" width={140} height={24} animation="wave" />
          <Skeleton variant="text" width="100%" height={20} animation="wave" />
          <Skeleton variant="text" width="95%" height={20} animation="wave" />
          <Skeleton variant="text" width="90%" height={20} animation="wave" />
        </div>

        <div className="space-y-2 pt-2">
          <Skeleton variant="text" width={180} height={24} animation="wave" />
          <Skeleton variant="text" width="100%" height={18} animation="wave" />
          <Skeleton variant="text" width="98%" height={18} animation="wave" />
          <Skeleton variant="text" width="92%" height={18} animation="wave" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center border border-gray-200 shadow-sm">
        <p className="text-sm font-semibold text-gray-700">
          Select a job to view details
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
      {/* Top Header Card */}
      <div className="p-6 pb-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-200/70 p-2 shrink-0 flex items-center justify-center">
              <img
                src={mediaUrl(job.companyLogo)}
                alt={`${job.company} logo`}
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-bold text-gray-900">
                  {job.company}
                </span>
                {job.verified && (
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 fill-emerald-50"
                  />
                )}
                {job.fundingStage && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {job.fundingStage}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-1 tracking-tight">
                {job.title} - {job.department.split("&")[0].trim()}
              </h2>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-gray-400" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-gray-400" />
                  Full-time Role
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Eye size={13} className="text-emerald-600" />
                  {job.viewsToday || 43} people viewed today
                </span>
              </div>
            </div>
          </div>

          {/* Action Icons (Share & Bookmark) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Share Job"
              onClick={() => onShareClick?.(job)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            >
              <Share2 size={17} />
            </button>
            <button
              type="button"
              aria-label={isSaved ? "Unsave Job" : "Save Job"}
              onClick={(e) => onToggleSave(job.id, e)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-indigo-600 transition-colors cursor-pointer"
            >
              <Bookmark
                size={17}
                className={isSaved ? "fill-indigo-600 text-indigo-600" : ""}
              />
            </button>
          </div>
        </div>

        {/* Total Base Compensation Box */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50/80 border border-gray-200/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Total Base Compensation
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {job.salaryRange.replace("k", ",000").replace("k", ",000")}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {job.equityInfo || "/ year + Significant Equity"}
              </span>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onApplyClick(job)}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Zap size={16} className="fill-current" />
              <span>Apply Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 px-6 border-b border-gray-200 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`py-3.5 border-b-2 transition-all cursor-pointer ${activeTab === "overview"
              ? "text-indigo-600 border-indigo-600 font-bold"
              : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`py-3.5 border-b-2 transition-all cursor-pointer ${activeTab === "team"
              ? "text-indigo-600 border-indigo-600 font-bold"
              : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
          Team & Culture
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("benefits")}
          className={`py-3.5 border-b-2 transition-all cursor-pointer ${activeTab === "benefits"
              ? "text-indigo-600 border-indigo-600 font-bold"
              : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
          Salary & Benefits
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("interview")}
          className={`py-3.5 border-b-2 transition-all cursor-pointer ${activeTab === "interview"
              ? "text-indigo-600 border-indigo-600 font-bold"
              : "text-gray-500 border-transparent hover:text-gray-800"
            }`}
        >
          Interview Process
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-23rem)] overflow-y-auto">
        {activeTab === "overview" && (
          <>
            {/* Hiring Manager Card */}
            <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/70 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={mediaUrl(job.hiringManager.avatar)}
                  alt={job.hiringManager.name}
                  className="w-11 h-11 rounded-full object-cover border border-gray-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">
                      {job.hiringManager.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      Hiring Manager
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {job.hiringManager.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                View Profile
              </button>
            </div>

            {/* About the Role */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                About the Role
              </h3>
              {job.aboutRole.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="text-xs text-gray-600 leading-relaxed mb-2.5 font-normal"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Responsibilities & Qualifications */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2.5">
                Key Responsibilities & Qualifications
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed font-normal">
                      {resp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              Culture & Engineering Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {job.cultureStats.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <p className="text-[10px] text-gray-500 font-semibold uppercase">
                    {stat.label}
                  </p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              Benefits & Perks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {job.rewards.map((reward, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <p className="text-xs font-bold text-gray-900">
                    {reward.title}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                    {reward.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "interview" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">
              Hiring Process Overview
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Recruiter Initial Screen (30m)
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Mutual fit, background alignment, and compensation expectations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Hiring Manager Portfolio Deep-Dive (45m)
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Walkthrough of high-impact systems projects and design craft.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="text-xs font-bold text-gray-900">
                    Collaborative Systems Design Session (60m)
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Real-time pairing on token taxonomy, state logic, and component architecture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailPane;
