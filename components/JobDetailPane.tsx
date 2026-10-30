"use client";

import React, { useState } from "react";
import { JobItem } from "@/typescript/interface/job.interface";

interface JobDetailPaneProps {
  job: JobItem | null;
  isSaved: boolean;
  onToggleSave: (id: number, e: React.MouseEvent) => void;
  onApplyClick: (job: JobItem) => void;
  onShareClick?: (job: JobItem) => void;
}

export const JobDetailPane: React.FC<JobDetailPaneProps> = ({
  job,
  isSaved,
  onToggleSave,
  onApplyClick,
  onShareClick,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "team" | "benefits" | "interview"
  >("overview");

  if (!job) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center border border-surface-container">
        <p className="font-headline-sm text-on-surface">Select a job to view details</p>
      </div>
    );
  }

  return (
    <div className="sticky top-20 bg-surface-container-lowest rounded-xl shadow-xl shadow-surface-dim/40 overflow-hidden border border-surface-container">
      {/* Banner Hero Header on Selected Job */}
      <div className="relative bg-gradient-to-r from-surface-container-highest via-surface-container to-surface-container-low p-space-lg">
        <div className="flex items-start justify-between gap-space-md">
          <div className="flex items-start gap-space-md">
            <div className="w-16 h-16 rounded-xl bg-surface-container-lowest p-2 shadow-md shrink-0 flex items-center justify-center border border-surface-container">
              <img
                src={job.companyLogo}
                alt={`${job.company} logo`}
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  {job.company}
                </span>
                {job.verified && (
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified
                  </span>
                )}
                {job.fundingStage && (
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold ml-1">
                    {job.fundingStage}
                  </span>
                )}
              </div>

              <h2
                className="font-headline-lg text-headline-lg text-on-surface mt-1 font-bold"
                id="detailTitle"
              >
                {job.title} - {job.department}
              </h2>

              <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    location_on
                  </span>{" "}
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    schedule
                  </span>{" "}
                  Full-time Role
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-secondary font-medium">
                  <span className="material-symbols-outlined text-[16px]">
                    visibility
                  </span>{" "}
                  {job.viewsToday || 43} people viewed today
                </span>
              </div>
            </div>
          </div>

          {/* Top Action Controls */}
          <div className="flex items-center gap-space-xs shrink-0">
            <button
              type="button"
              aria-label="Share Job"
              onClick={() => onShareClick?.(job)}
              className="w-10 h-10 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface transition-colors shadow-sm border border-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">
                share
              </span>
            </button>
            <button
              type="button"
              aria-label={isSaved ? "Unsave Job" : "Save to Bookmarks"}
              onClick={(e) => onToggleSave(job.id, e)}
              className="w-10 h-10 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-primary transition-colors shadow-sm border border-surface-container"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: `'FILL' ${isSaved ? 1 : 0}` }}
              >
                bookmark
              </span>
            </button>
          </div>
        </div>

        {/* Action CTA Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-space-md mt-space-lg pt-space-md bg-surface-container-lowest/80 backdrop-blur-md p-space-md rounded-xl border border-surface-container/60">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
              Total Base Compensation
            </p>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                {job.salaryRange}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {job.equityInfo || "/ year + Significant Equity"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <button
              type="button"
              onClick={() => onApplyClick(job)}
              className="h-11 px-space-xl bg-primary-container text-on-primary rounded-lg font-headline-sm text-headline-sm flex items-center gap-space-xs shadow-md shadow-primary/30 hover:bg-primary active:scale-[0.98] transition-all cursor-pointer font-semibold"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Apply Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Detail Pane */}
      <div className="flex items-center gap-space-md px-space-lg bg-surface-container-lowest border-b border-surface-container">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`py-space-md font-headline-sm text-headline-sm transition-all border-b-2 ${
            activeTab === "overview"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`py-space-md font-body-md text-body-md transition-all border-b-2 ${
            activeTab === "team"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Team & Culture
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("benefits")}
          className={`py-space-md font-body-md text-body-md transition-all border-b-2 ${
            activeTab === "benefits"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Salary & Benefits
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("interview")}
          className={`py-space-md font-body-md text-body-md transition-all border-b-2 ${
            activeTab === "interview"
              ? "text-primary border-primary font-bold"
              : "text-on-surface-variant border-transparent hover:text-on-surface"
          }`}
        >
          Interview Process
        </button>
      </div>

      {/* Scrollable Pane Body */}
      <div className="p-space-lg space-y-space-lg max-h-[calc(100vh-22rem)] overflow-y-auto pr-space-md">
        {activeTab === "overview" && (
          <>
            {/* Executive Hiring Manager Card */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container">
              <div className="flex items-center gap-space-md">
                <img
                  src={job.hiringManager.avatar}
                  alt={job.hiringManager.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-surface-container"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {job.hiringManager.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                      Hiring Manager
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {job.hiringManager.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="px-space-md py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors shadow-sm border border-surface-container"
              >
                View Profile
              </button>
            </div>

            {/* Role Scope Overview */}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-sm font-semibold">
                About the Role
              </h3>
              {job.aboutRole.map((paragraph, idx) => (
                <p
                  key={idx}
                  className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Requirements / Qualifications */}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md font-semibold">
                Key Responsibilities & Qualifications
              </h3>
              <div className="space-y-space-sm">
                {job.responsibilities.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {req}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Culture Metrics & Stats */}
            <div className="bg-surface-container-low p-space-md rounded-xl border border-surface-container">
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">
                Team Culture & Engineering Benchmarks
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md text-center">
                {job.cultureStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-surface-container/60"
                  >
                    <p
                      className={`font-headline-lg text-headline-lg font-bold ${
                        stat.highlight === "primary"
                          ? "text-primary"
                          : stat.highlight === "secondary"
                          ? "text-secondary"
                          : "text-on-surface"
                      }`}
                    >
                      {stat.value}
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack & Required Tools */}
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-sm font-semibold">
                Required Tools & Paradigms
              </h4>
              <div className="flex flex-wrap gap-space-xs">
                {job.requiredTools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-space-md py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-medium border border-surface-container/60"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits Bento */}
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">
                Verified Total Rewards
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
                {job.rewards.map((perk, idx) => (
                  <div
                    key={idx}
                    className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-sm border border-surface-container/60"
                  >
                    <span
                      className={`material-symbols-outlined text-[24px] ${
                        perk.color === "secondary"
                          ? "text-secondary"
                          : "text-primary"
                      }`}
                    >
                      {perk.icon}
                    </span>
                    <div>
                      <h5 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                        {perk.title}
                      </h5>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "team" && (
          <div className="space-y-space-md">
            <h3 className="font-headline-md text-on-surface font-semibold">
              Team & Mission
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Our teams operate with extreme autonomy, minimal managerial layers,
              and direct user feedback loops. Engineers and designers pair
              daily, submitting code directly into shared codebases.
            </p>
            <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container">
              <h4 className="font-headline-sm text-on-surface font-semibold mb-2">
                Work Cadence
              </h4>
              <ul className="space-y-2 text-on-surface-variant font-body-sm">
                <li>• Flexible async communication policy via Slack & Linear</li>
                <li>• Focus Wednesdays: Zero internal team meetings</li>
                <li>• Bi-annual in-person company product hackathons</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="space-y-space-md">
            <h3 className="font-headline-md text-on-surface font-semibold">
              Comprehensive Compensation & Rewards
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              We offer top of market cash compensation benchmarked against top
              95th percentile tier-1 tech firms, with transparent annual band
              reviews.
            </p>
            <div className="grid grid-cols-1 gap-space-sm">
              {job.rewards.map((perk, idx) => (
                <div
                  key={idx}
                  className="p-space-md rounded-xl bg-surface-container-low flex items-start gap-space-md border border-surface-container"
                >
                  <span className="material-symbols-outlined text-[26px] text-primary">
                    {perk.icon}
                  </span>
                  <div>
                    <h5 className="font-headline-sm text-on-surface font-semibold">
                      {perk.title}
                    </h5>
                    <p className="font-body-sm text-on-surface-variant">
                      {perk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "interview" && (
          <div className="space-y-space-md">
            <h3 className="font-headline-md text-on-surface font-semibold">
              Transparent Interview Stages
            </h3>
            <div className="space-y-space-sm">
              <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-label-sm text-primary font-bold">
                  Stage 1: 30 Mins
                </span>
                <h5 className="font-headline-sm text-on-surface font-semibold">
                  Recruiter & Values Alignment
                </h5>
                <p className="font-body-sm text-on-surface-variant">
                  Discussion regarding background, career aspirations, and team fit.
                </p>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-label-sm text-primary font-bold">
                  Stage 2: 45 Mins
                </span>
                <h5 className="font-headline-sm text-on-surface font-semibold">
                  Portfolio & Technical Deep Dive with {job.hiringManager.name}
                </h5>
                <p className="font-body-sm text-on-surface-variant">
                  Walkthrough of real-world design systems or frontend infrastructure you built.
                </p>
              </div>
              <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-container">
                <span className="font-label-sm text-primary font-bold">
                  Stage 3: Half-Day
                </span>
                <h5 className="font-headline-sm text-on-surface font-semibold">
                  Virtual Onsite & Cross-Functional Collaboration
                </h5>
                <p className="font-body-sm text-on-surface-variant">
                  Paid practical pairing session with product managers and engineers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Prompt in Pane */}
        <div className="p-space-md rounded-xl bg-primary text-on-primary flex items-center justify-between shadow-lg">
          <div>
            <p className="font-headline-sm text-headline-sm font-semibold">
              Ready to build for millions of developers?
            </p>
            <p className="font-body-sm text-body-sm opacity-90">
              Your profile is a {job.skillsMatch}% direct match for this position.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onApplyClick(job)}
            className="px-space-lg py-2.5 bg-surface-container-lowest text-primary rounded-lg font-headline-sm text-headline-sm hover:bg-surface-container transition-all cursor-pointer font-semibold shrink-0"
          >
            Submit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPane;

