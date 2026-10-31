"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { mediaUrl } from "@/utils/media";
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
} from "lucide-react";

export default function MyProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout, refreshProfile } = useAuth();

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
            <div className="flex items-center gap-2 self-start md:self-end">
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

        {/* Dashboard Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
            <span className="text-xs text-gray-500 font-medium">
              Applications Sent
            </span>
            <p className="text-2xl font-bold text-indigo-600 mt-1">12</p>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <TrendingUp size={13} />
              3 in review this week
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
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                Candidate Overview
              </h2>
              <div className="space-y-4 text-xs text-gray-600">
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
                    Senior Software Engineer / Product Designer
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                    Preferred Work Mode
                  </h4>
                  <p className="text-gray-900 font-medium">
                    Remote / Hybrid (San Francisco, CA or Worldwide)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
              <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Code2 size={18} className="text-indigo-600" />
                Core Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
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
                ].map((skill) => (
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

      <Footer />
    </div>
  );
}
