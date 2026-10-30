"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobSearchConsole from "@/components/JobSearchConsole";
import JobListFeed from "@/components/JobListFeed";
import JobDetailPane from "@/components/JobDetailPane";
import ApplyModal from "@/components/ApplyModal";
import AuthModal from "@/components/AuthModal";
import { INITIAL_JOBS } from "@/lib/jobData";
import { JobItem, JobFilterState } from "@/typescript/interface/job.interface";
import { UserProfile } from "@/api/functions/user.api";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user: currentUser, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authBannerMsg, setAuthBannerMsg] = useState("");

  // Search & Filter State matching design defaults
  const [filters, setFilters] = useState<JobFilterState>({
    roleQuery: "Senior Product Designer",
    locationQuery: "San Francisco, CA or Remote",
    radius: "+50 mi",
    remoteOnly: false,
    fullTimeOnly: false,
    minSalary150k: true,
    category: "All",
    easyApplyOnly: false,
    sortBy: "recent",
  });

  // Selected job for right-hand preview pane
  const [selectedJobId, setSelectedJobId] = useState<number>(1);

  // Saved bookmark IDs
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set([1]));

  // 1-Click Fast Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<JobItem | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter((job) => {
      // Role / keyword query
      if (filters.roleQuery.trim()) {
        const query = filters.roleQuery.toLowerCase();
        const matchesRole =
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.department.toLowerCase().includes(query) ||
          job.requiredTools.some((t) => t.toLowerCase().includes(query));
        if (!matchesRole) return false;
      }

      // Location query
      if (filters.locationQuery.trim()) {
        const loc = filters.locationQuery.toLowerCase();
        if (loc.includes("remote") && job.isRemote) {
          // match
        } else {
          const matchesLoc = job.location.toLowerCase().includes(loc);
          if (!matchesLoc && !loc.includes("remote")) return false;
        }
      }

      // Quick tags
      if (filters.remoteOnly && !job.isRemote) return false;
      if (filters.fullTimeOnly && !job.isFullTime) return false;
      if (filters.easyApplyOnly && !job.isEasyApply) return false;
      if (filters.minSalary150k && job.salaryMin < 150000) return false;

      // Category
      if (filters.category !== "All" && job.category !== filters.category) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "comp") {
        return b.salaryMax - a.salaryMax;
      }
      return 0;
    });
  }, [filters]);

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));

  // Active selected job details
  const activeJob = useMemo(() => {
    const found = filteredJobs.find((j) => j.id === selectedJobId);
    return found || filteredJobs[0] || null;
  }, [filteredJobs, selectedJobId]);

  // Handler for filter field changes
  const handleFilterChange = <K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
  };

  // Select job card
  const handleSelectJob = (id: number) => {
    setSelectedJobId(id);
  };

  // Toggle bookmark save
  const handleToggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Trigger 1-Click Fast Apply modal
  const handleQuickApply = (job: JobItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleApplyNow = (job: JobItem) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  // Application submission callback
  const handleConfirmApplication = (job: JobItem, note: string) => {
    console.log("Application submitted:", {
      jobId: job.id,
      title: job.title,
      company: job.company,
      applicant: currentUser ? currentUser.email : "Anonymous Candidate",
      note,
    });
  };

  // Handle successful Auth (Login / Register)
  const handleAuthSuccess = (user: UserProfile) => {
    setAuthBannerMsg(
      `Welcome, ${user.name}! Your profile is active and verified in WorkSphere.`
    );
    setTimeout(() => setAuthBannerMsg(""), 6000);
  };

  // Share job link
  const handleShare = (job: JobItem) => {
    if (navigator.share) {
      navigator
        .share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this ${job.title} role at ${job.company} with ${job.salaryRange} compensation on WorkSphere!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Job link copied to clipboard!");
    }
  };

  return (
    <>
      {/* 1. Header Navigation */}
      <Navbar
        user={currentUser}
        savedCount={savedJobIds.size}
        onOpenSearch={() => {
          const el = document.getElementById("job-role-input");
          el?.focus();
        }}
        onOpenSaved={() => {
          setFilters((prev) => ({
            ...prev,
            roleQuery: "",
            locationQuery: "",
          }));
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={logout}
      />

      {/* Auth confirmation notification banner */}
      {authBannerMsg && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 bg-secondary-fixed text-on-secondary-fixed px-space-md py-space-sm rounded-full shadow-lg border border-secondary flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          <span className="font-headline-sm text-body-sm font-semibold">
            {authBannerMsg}
          </span>
          <button
            type="button"
            onClick={() => setAuthBannerMsg("")}
            className="ml-2 hover:opacity-70"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen bg-surface flex flex-col">
        {/* 2. Top Job Search & Filter Console */}
        <JobSearchConsole
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* 3. Split-Pane Layout Container: 40% Feed + 60% Detail Pane */}
        <div className="flex-1 max-w-[1400px] w-full mx-auto px-gutter py-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column (5/12 cols ~41%): Job Feed */}
          <div className="lg:col-span-5 w-full">
            <JobListFeed
              jobs={paginatedJobs}
              totalCount={filteredJobs.length}
              selectedJobId={selectedJobId}
              savedJobIds={savedJobIds}
              sortBy={filters.sortBy}
              currentPage={currentPage}
              totalPages={totalPages}
              onSelectJob={handleSelectJob}
              onToggleSave={handleToggleSave}
              onQuickApply={handleQuickApply}
              onSortChange={(sort) => handleFilterChange("sortBy", sort)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {/* Right Column (7/12 cols ~59%): Sticky Job Detail Pane */}
          <div className="lg:col-span-7 w-full hidden lg:block sticky top-20">
            <JobDetailPane
              job={activeJob}
              isSaved={activeJob ? savedJobIds.has(activeJob.id) : false}
              onToggleSave={handleToggleSave}
              onApplyClick={handleApplyNow}
              onShareClick={handleShare}
            />
          </div>
        </div>

        {/* 4. Global Footer */}
        <Footer />
      </main>

      {/* Fast 1-Click Apply Modal */}
      <ApplyModal
        job={jobToApply}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleConfirmApplication}
      />

      {/* Unified Auth Modal (Sign In / Register / Verify OTP) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
