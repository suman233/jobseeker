"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body-md text-on-surface-variant font-medium">
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
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 px-gutter max-w-[1200px] w-full mx-auto">
        {/* Profile Header Banner */}
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container shadow-sm p-space-lg md:p-space-xl relative overflow-hidden mb-space-lg">
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-primary-container via-primary to-surface-tint opacity-90"></div>

          <div className="relative pt-12 flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            {/* Avatar & Core Info */}
            <div className="flex items-end gap-space-md">
              <div className="relative">
                <img
                  alt={`${user.name} Profile`}
                  src={
                    user.image ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCAFhTFfcq0WQSRKQhiq1Z5gW0fXxn9zl5-UYI_K4aaAjHhIxShHUAwL_CEpVNdCOWqsco46AH248pxpYCln9BHM4Xmxtrm6LZLX3Lq_O-Ox1-83wQAJD7gKGwa3JCI2F1ysCiM8451wlguJlW6oMXOBYSZzr8KiG8wHn5WnCM1cjdX7-0IRp9VTGmxM1q8TWYOb8a4jVEkINLX3jZLlojVAAGd9VdH5QKi6YJ3VQ"
                  }
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-surface-container-lowest shadow-md bg-surface"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
              </div>

              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    Verified Candidate
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-space-sm self-start md:self-end">
              <Link
                href="/"
                className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Browse Jobs</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="px-space-md py-2 rounded-xl bg-surface-container-low text-error hover:bg-error-container hover:text-on-error-container transition-all font-headline-sm text-body-sm font-semibold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md mb-space-lg">
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container">
            <span className="font-label-md text-on-surface-variant font-medium">
              Applications Sent
            </span>
            <p className="font-headline-xl text-3xl font-bold text-primary mt-1">12</p>
            <span className="text-label-sm text-secondary font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              3 in review this week
            </span>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container">
            <span className="font-label-md text-on-surface-variant font-medium">
              Profile Views
            </span>
            <p className="font-headline-xl text-3xl font-bold text-on-surface mt-1">48</p>
            <span className="text-label-sm text-secondary font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              From top tech recruiters
            </span>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container">
            <span className="font-label-md text-on-surface-variant font-medium">
              Saved Jobs
            </span>
            <p className="font-headline-xl text-3xl font-bold text-on-surface mt-1">8</p>
            <span className="text-label-sm text-on-surface-variant font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">bookmark</span>
              Active postings
            </span>
          </div>

          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container">
            <span className="font-label-md text-on-surface-variant font-medium">
              Member Since
            </span>
            <p className="font-headline-md text-xl font-bold text-on-surface mt-2 truncate">
              {memberSince}
            </p>
            <span className="text-label-sm text-on-surface-variant font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              WorkSphere Network
            </span>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm">
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">badge</span>
                Candidate Overview
              </h2>
              <div className="space-y-space-md text-body-md text-on-surface-variant">
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider mb-1">
                    Role Category
                  </h4>
                  <p className="text-on-surface font-medium capitalize">
                    {user.role} (Registered & Active)
                  </p>
                </div>

                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider mb-1">
                    Email Verification Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="text-on-surface font-medium">
                      Email address verified via OTP
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider mb-1">
                    Target Position
                  </h4>
                  <p className="text-on-surface">
                    Senior Software Engineer / Product Designer
                  </p>
                </div>

                <div>
                  <h4 className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider mb-1">
                    Preferred Work Mode
                  </h4>
                  <p className="text-on-surface">
                    Remote / Hybrid (San Francisco, CA or Worldwide)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm">
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">code</span>
                Core Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
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
                    className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-body-sm font-medium border border-surface-container-high"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-surface-container shadow-sm">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-space-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">security</span>
                Account Security
              </h3>
              <ul className="space-y-space-sm text-body-sm text-on-surface-variant">
                <li className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span>Email Verified</span>
                  <span className="text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Active
                  </span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-surface-container">
                  <span>Two-Step Verification</span>
                  <span className="text-on-surface font-semibold">OTP via Email</span>
                </li>
                <li className="flex items-center justify-between py-1">
                  <span>Session Expiry</span>
                  <span className="text-on-surface">7 Days (JWT)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary-fixed to-secondary-fixed/40 p-space-lg rounded-2xl border border-surface-container shadow-sm">
              <h4 className="font-headline-sm text-headline-sm font-bold text-on-primary-fixed mb-1">
                Looking for new roles?
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Over 1,200+ venture-backed engineering and design teams are actively hiring on WorkSphere.
              </p>
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-space-md rounded-xl bg-primary text-on-primary font-headline-sm text-body-sm font-semibold hover:bg-primary-container transition-all shadow-sm"
              >
                <span>Find Matched Positions</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
