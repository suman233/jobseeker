"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobSearchConsole from "@/components/JobSearchConsole";
import JobListFeed from "@/components/JobListFeed";
import JobDetailPane from "@/components/JobDetailPane";
import ApplyModal from "@/components/ApplyModal";
import AuthModal from "@/components/AuthModal";
import { INITIAL_JOBS } from "@/lib/jobData";
import { JobItem, JobFilterState } from "@/typescript/interface/job.interface";
import { fetchJobsApi } from "@/api/functions/job.api";
import { UserProfile } from "@/api/functions/user.api";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle2, X } from "lucide-react";

export default function Home() {
  const { user: currentUser, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authBannerMsg, setAuthBannerMsg] = useState("");

  // Search & Filter State - starts completely EMPTY as requested
  const [filters, setFilters] = useState<JobFilterState>({
    roleQuery: "",
    locationQuery: "",
    radius: "+50 mi",
    remoteOnly: false,
    fullTimeOnly: false,
    minSalary150k: false,
    category: "All",
    easyApplyOnly: false,
    sortBy: "recent",
  });

  // Dynamic jobs list from backend API
  const [allJobs, setAllJobs] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Selected job for right-hand preview pane
  const [selectedJobId, setSelectedJobId] = useState<number | string>("");

  // Saved bookmark IDs
  const [savedJobIds, setSavedJobIds] = useState<Set<number | string>>(new Set());

  // 1-Click Fast Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<JobItem | null>(null);

  // Mobile detail drawer/modal state for responsive views (<1024px)
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // Load jobs from Backend API
  const loadJobsFromApi = useCallback(async (currentFilters: JobFilterState) => {
    setIsLoading(true);
    try {
      const res = await fetchJobsApi(currentFilters);
      if (res && res.data && res.data.length > 0) {
        setAllJobs(res.data);
        setSelectedJobId((prev) => {
          if (prev && res.data.some((j) => String(j.id) === String(prev))) {
            return prev;
          }
          return res.data[0].id;
        });
      } else {
        setAllJobs(INITIAL_JOBS);
        if (INITIAL_JOBS.length > 0) {
          setSelectedJobId(INITIAL_JOBS[0].id);
        }
      }
    } catch (err) {
      console.warn("API load failed, using local catalog:", err);
      setAllJobs(INITIAL_JOBS);
      if (INITIAL_JOBS.length > 0) {
        setSelectedJobId(INITIAL_JOBS[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadJobsFromApi(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search trigger when typing in search inputs or toggling filters
  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobsFromApi(filters);
    }, 350);

    return () => clearTimeout(timer);
  }, [
    filters.roleQuery,
    filters.locationQuery,
    filters.remoteOnly,
    filters.fullTimeOnly,
    filters.minSalary150k,
    filters.category,
    filters.easyApplyOnly,
    filters.sortBy,
    loadJobsFromApi,
  ]);

  // Synchronous client-side filter over loaded jobs for instantaneous feedback
  const filteredJobs = useMemo(() => {
    const source = allJobs.length > 0 ? allJobs : INITIAL_JOBS;
    return source.filter((job) => {
      // Role / Keywords query matching
      if (filters.roleQuery.trim()) {
        const query = filters.roleQuery.toLowerCase();
        const words = query.split(/\s+/).filter(Boolean);
        const matchesAnyWord = words.some(
          (w) =>
            job.title.toLowerCase().includes(w) ||
            job.company.toLowerCase().includes(w) ||
            (job.department && job.department.toLowerCase().includes(w)) ||
            (job.requiredTools && job.requiredTools.some((t) => t.toLowerCase().includes(w)))
        );
        if (!matchesAnyWord) return false;
      }

      // Location query matching
      if (filters.locationQuery.trim()) {
        const loc = filters.locationQuery.toLowerCase();
        if (loc.includes("remote") && job.isRemote) {
          // match remote
        } else {
          const matchesLoc =
            job.location.toLowerCase().includes(loc) ||
            loc.includes("san francisco");
          if (!matchesLoc && !job.isRemote) return false;
        }
      }

      // Fast Filter options
      if (filters.remoteOnly && !job.isRemote) return false;
      if (filters.fullTimeOnly && !job.isFullTime) return false;
      if (filters.easyApplyOnly && !job.isEasyApply) return false;
      if (filters.minSalary150k && (job.salaryMin || 0) < 150000) return false;

      // Category
      if (filters.category !== "All" && job.category !== filters.category) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "comp") {
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      }
      return 0;
    });
  }, [allJobs, filters]);

  // Total opportunities count display
  const totalCount = filteredJobs.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Paginated slice
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredJobs.slice(startIndex, startIndex + pageSize);
  }, [filteredJobs, currentPage, pageSize]);

  // Active selected job details
  const activeJob = useMemo(() => {
    const found = filteredJobs.find((j) => String(j.id) === String(selectedJobId));
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
    loadJobsFromApi(filters);
  };

  // Select job card (and open drawer on mobile)
  const handleSelectJob = (id: number | string) => {
    setSelectedJobId(id);
    if (window.innerWidth < 1024) {
      setMobileDetailOpen(true);
    }
  };

  // Toggle bookmark save
  const handleToggleSave = (id: number | string, e: React.MouseEvent) => {
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

  // Trigger 1-Click Fast Apply modal (Requires Authentication)
  const handleQuickApply = (job: JobItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setJobToApply(job);
      setAuthBannerMsg("Please sign in to apply for this position.");
      setIsAuthModalOpen(true);
      return;
    }
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleApplyNow = (job: JobItem) => {
    if (!currentUser) {
      setJobToApply(job);
      setAuthBannerMsg("Please sign in to apply for this position.");
      setIsAuthModalOpen(true);
      return;
    }
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

  // Handle successful Auth
  const handleAuthSuccess = (user: UserProfile) => {
    setAuthBannerMsg(
      `Welcome, ${user.name}! Your profile is active and verified in WorkSphere.`
    );
    setTimeout(() => setAuthBannerMsg(""), 6000);
    // If candidate clicked apply before logging in, seamlessly open application modal
    if (jobToApply) {
      setTimeout(() => {
        setIsApplyModalOpen(true);
      }, 400);
    }
  };

  // Share job link
  const handleShare = (job: JobItem) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${job.title} at ${job.company}`,
          text: `Check out this ${job.title} role at ${job.company} with ${job.salaryRange} on WorkSphere!`,
          url: window.location.href,
        })
        .catch(() => { });
    } else if (typeof navigator !== "undefined") {
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
          const el = document.getElementById("searchRole");
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-50 text-emerald-800 px-4 py-2 rounded-full shadow-lg border border-emerald-300 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{authBannerMsg}</span>
          <button
            type="button"
            onClick={() => setAuthBannerMsg("")}
            className="ml-2 hover:opacity-75"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pt-16 min-h-screen bg-slate-50/60 flex flex-col">
        {/* 2. Top Job Search & Filter Console (Starts empty, triggers search seamlessly) */}
        <JobSearchConsole
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* 3. Split-Pane Layout Container: Left Feed (5 cols) + Right Detail Pane (7 cols) */}
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5/12 cols): Job Feed with MUI Skeleton Loader */}
          <div className="lg:col-span-5 w-full">
            <JobListFeed
              jobs={paginatedJobs}
              totalCount={totalCount}
              selectedJobId={selectedJobId}
              savedJobIds={savedJobIds}
              sortBy={filters.sortBy}
              currentPage={currentPage}
              totalPages={totalPages}
              isLoading={isLoading}
              onSelectJob={handleSelectJob}
              onToggleSave={handleToggleSave}
              onQuickApply={handleQuickApply}
              onSortChange={(sort) => handleFilterChange("sortBy", sort)}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

          {/* Right Column (7/12 cols): Sticky Job Detail Pane with MUI Skeleton Loader */}
          <div className="lg:col-span-7 w-full hidden lg:block sticky top-20">
            <JobDetailPane
              job={activeJob}
              isSaved={activeJob ? savedJobIds.has(activeJob.id) : false}
              isLoading={isLoading}
              onToggleSave={handleToggleSave}
              onApplyClick={handleApplyNow}
              onShareClick={handleShare}
            />
          </div>
        </div>

        {/* Mobile Detail Modal / Sheet for small screens (<1024px) */}
        {mobileDetailOpen && activeJob && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-gray-900/60 backdrop-blur-xs p-3">
            <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden max-w-lg w-full mx-auto my-auto max-h-[90vh]">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  Job Details
                </span>
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <JobDetailPane
                  job={activeJob}
                  isSaved={savedJobIds.has(activeJob.id)}
                  isLoading={isLoading}
                  onToggleSave={handleToggleSave}
                  onApplyClick={(job) => {
                    setMobileDetailOpen(false);
                    handleApplyNow(job);
                  }}
                  onShareClick={handleShare}
                />
              </div>
            </div>
          </div>
        )}

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
        initialMode="login"
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
