"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/hooks/useAuth";
import { mediaUrl } from "@/utils/media";
import { fetchUserApplicationsApi } from "@/api/functions/job.api";
import { JobApplication } from "@/typescript/interface/job.interface";
import {
  CheckCircle2,
  Mail,
  Search,
  LogOut,
  TrendingUp,
  Eye,
  Bookmark,
  Calendar,
  ShieldCheck,
  Code2,
  ArrowRight,
  User,
  Pencil,
  Briefcase,
  MapPin,
  Phone,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, token, isLoggedIn, isLoading, logout, refreshProfile, updateUser } =
    useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState(true);
  const [profileBanner, setProfileBanner] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/auth/login?returnUrl=/dashboard/my-profile");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    if (isLoggedIn) {
      refreshProfile();
    }
  }, [isLoggedIn, refreshProfile]);

  useEffect(() => {
    if (isLoggedIn && user) {
      setIsLoadingApps(true);
      fetchUserApplicationsApi(user._id, token || undefined)
        .then((res) => {
          if (res.status && Array.isArray(res.data)) {
            setAppliedJobs(res.data);
          }
        })
        .finally(() => setIsLoadingApps(false));
    }
  }, [isLoggedIn, user?._id, token]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-medium">
            Loading candidate profile...
          </p>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-4 max-w-[1200px] w-full mx-auto">
        {/* Profile Header Banner */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-600 opacity-90"></div>

          <div className="relative pt-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* Avatar & Core Info */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  alt={`${user.name} Profile`}
                  src={
                    mediaUrl(user.image, "user") ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                  }
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80";
                  }}
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    Verified Candidate
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Mail size={14} className="text-gray-400" />
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Pencil size={14} className="text-indigo-600" />
                <span>Edit Profile</span>
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Search size={14} />
                <span>Browse Jobs</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notification Banner */}
        {profileBanner && (
          <div className="mb-4 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-semibold shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{profileBanner}</span>
            </div>
            <button
              type="button"
              onClick={() => setProfileBanner("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Dashboard Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">
              Applications Sent
            </span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {appliedJobs.length}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <TrendingUp size={13} />
              {appliedJobs.length > 0 ? `${appliedJobs.length} active in pipeline` : "Ready to apply"}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">
              Profile Views
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">48</p>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <Eye size={13} />
              From top tech recruiters
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">
              Saved Jobs
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-1">
              <Bookmark size={13} />
              Active postings
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">
              Member Since
            </span>
            <p className="text-lg font-bold text-gray-900 mt-2 truncate">
              {memberSince}
            </p>
            <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 mt-1">
              <Calendar size={13} />
              WorkSphere Network
            </span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Overview Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <User size={18} className="text-indigo-600" />
                  Candidate Overview
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={13} />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Role Category
                  </h4>
                  <p className="text-gray-900 font-semibold capitalize">
                    {user.role} (Registered & Active)
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Email Verification Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-900 font-medium">
                      Email address verified via OTP
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Target Position
                  </h4>
                  <p className="text-gray-900 font-medium">
                    {user.headline || "Senior Software Engineer / Product Designer"}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Location & Work Mode
                  </h4>
                  <p className="text-gray-900 font-medium">
                    {user.location || "Remote / Hybrid (San Francisco, CA or Worldwide)"}
                  </p>
                </div>

                {user.phone && (
                  <div>
                    <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                      Contact Phone
                    </h4>
                    <p className="text-gray-900 font-medium">{user.phone}</p>
                  </div>
                )}
              </div>

              {user.bio && (
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Professional Bio
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                </div>
              )}
            </div>

            {/* Applied Positions Tracker */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-600" />
                  <h2 className="text-base font-bold text-gray-900">
                    My Job Applications
                  </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  {appliedJobs.length} {appliedJobs.length === 1 ? "Role" : "Roles"} Applied
                </span>
              </div>

              {isLoadingApps ? (
                <div className="py-8 text-center text-xs text-gray-500">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <span>Loading your applications...</span>
                </div>
              ) : appliedJobs.length === 0 ? (
                <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl p-6">
                  <Briefcase size={28} className="mx-auto text-gray-300 mb-2" />
                  <h4 className="text-xs font-bold text-gray-700">
                    No Applications Submitted Yet
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1 max-w-sm mx-auto">
                    Explore top venture-backed roles on WorkSphere and apply with 1-Click Fast Pass.
                  </p>
                  <Link
                    href="/"
                    className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-2xs"
                  >
                    <Search size={13} />
                    <span>Browse Open Positions</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appliedJobs.map((app) => {
                    const statusColors = {
                      Submitted: "bg-blue-50 text-blue-700 border-blue-200",
                      "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
                      Interviewing: "bg-purple-50 text-purple-700 border-purple-200",
                      Offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
                      Rejected: "bg-gray-100 text-gray-700 border-gray-200",
                    };
                    const statusClass =
                      statusColors[app.status] || "bg-blue-50 text-blue-700 border-blue-200";

                    const appliedDate = app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently";

                    return (
                      <div
                        key={app._id}
                        className="p-3.5 rounded-xl border border-gray-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={
                              mediaUrl(app.companyLogo, "job") ||
                              "https://lh3.googleusercontent.com/aida-public/AB6AXuD4MvwGVVIM-VqfhKpnmmtvThCkCUKgIaW6FHbIR9XriDqIAa4n9dNsx9rLOKcKauAu99VlT8gqFV4agpRCPQvIoP6xtLJqpIznimdPBYfUY4l7-M6kYLUdMyFd1_jB8hUTRnMnbMqdy7UMxBHw7hgoXknRppVbbi8qPAqhVe5_DXKq-y63jNdZg7D0pnYTWXVTuSMxff7NBqgtPhipQnI8RrTfu-QoneneBfOXc9Y"
                            }
                            alt={app.company}
                            className="w-10 h-10 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuD4MvwGVVIM-VqfhKpnmmtvThCkCUKgIaW6FHbIR9XriDqIAa4n9dNsx9rLOKcKauAu99VlT8gqFV4agpRCPQvIoP6xtLJqpIznimdPBYfUY4l7-M6kYLUdMyFd1_jB8hUTRnMnbMqdy7UMxBHw7hgoXknRppVbbi8qPAqhVe5_DXKq-y63jNdZg7D0pnYTWXVTuSMxff7NBqgtPhipQnI8RrTfu-QoneneBfOXc9Y";
                            }}
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {app.jobTitle}
                            </h4>
                            <p className="text-[11px] text-gray-500 font-medium">
                              {app.company} • {app.location || "Remote"}
                            </p>
                            {app.salaryRange && (
                              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                                {app.salaryRange}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}
                          >
                            {app.status}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                            <Clock size={11} />
                            Applied {appliedDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Core Skills Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Code2 size={18} className="text-indigo-600" />
                  Core Technical Skills
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Pencil size={13} />
                  <span>Edit Skills</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(user.skills && user.skills.length > 0
                  ? user.skills
                  : [
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Node.js",
                      "Express",
                      "MongoDB",
                      "Tailwind CSS",
                      "GraphQL",
                      "PostgreSQL",
                      "System Design",
                    ]
                ).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-600" />
                Account Security
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-600">
                <li className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span>Email Verified</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    Active
                  </span>
                </li>
                <li className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <span>Two-Step Verification</span>
                  <span className="text-gray-900 font-semibold">OTP via Email</span>
                </li>
                <li className="flex items-center justify-between py-1.5">
                  <span>Session Expiry</span>
                  <span className="text-gray-900">7 Days (JWT)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 shadow-2xs">
              <h4 className="text-sm font-bold text-indigo-950 mb-1">
                Looking for new roles?
              </h4>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Over 1,200+ venture-backed engineering and design teams are actively hiring on WorkSphere.
              </p>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm"
              >
                <span>Find Matched Positions</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        user={user}
        token={token}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          updateUser(updated);
          setProfileBanner("Profile updated successfully!");
          setTimeout(() => setProfileBanner(""), 5000);
        }}
      />

      <Footer />
    </div>
  );
}
