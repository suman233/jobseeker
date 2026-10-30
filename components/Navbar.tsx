"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/api/functions/user.api";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  user?: UserProfile | null;
  savedCount?: number;
  onOpenSearch?: () => void;
  onOpenSaved?: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user: propUser,
  savedCount = 1,
  onOpenSearch,
  onOpenSaved,
  onOpenAuth,
  onLogout: propLogout,
}) => {
  const pathname = usePathname();
  const { user: storeUser, logout: storeLogout, isLoggedIn } = useAuth();
  const user = propUser || storeUser;

  const [activeTab, setActiveTab] = useState("find-jobs");
  const [showNotificationBadge] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    if (propLogout) {
      propLogout();
    } else {
      storeLogout();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-[1280px] mx-auto px-gutter flex items-center justify-between gap-space-lg">
        {/* Brand & Main Nav */}
        <div className="flex items-center gap-space-xl">
          <Link
            href="/"
            className="flex items-center gap-space-sm focus:outline-none"
          >
            <img
              alt="WorkSphere Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Uvn_q5sMy6ZFlruW4qTx3MUU0DgKXJb3-GrOKP1u92HxxUoXSF6FcKU9LwEVAX0plxGfq90R6IEmEaTYZT8o5tjIMlNwQqRZRzp9w526wNddubsHU3y2csTc7vuG1Rj74eJG_dYbXU3gavTSYDmdDpqABqX4GonMoZ15AuLk3nT-WjEDKGzhArW0lPSVD0SlaSAtVSgEbnbaEAEQCJJrnmwGTMw9y_LY1qLwGNDoo"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              WorkSphere
            </span>
          </Link>

          <nav
            className="hidden xl:flex items-center gap-space-xs"
            aria-label="Main Navigation"
          >
            <Link
              href="/"
              onClick={() => setActiveTab("find-jobs")}
              className={`px-space-md py-space-sm transition-colors rounded-lg ${
                pathname === "/" && activeTab === "find-jobs"
                  ? "bg-surface-container-high text-on-surface font-headline-sm text-headline-sm"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Find Jobs
            </Link>
            <button
              type="button"
              onClick={() => setActiveTab("applied-tracker")}
              className={`px-space-md py-space-sm transition-colors rounded-lg ${
                activeTab === "applied-tracker"
                  ? "bg-surface-container-high text-on-surface font-headline-sm text-headline-sm"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Applied Tracker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("companies")}
              className={`px-space-md py-space-sm transition-colors rounded-lg ${
                activeTab === "companies"
                  ? "bg-surface-container-high text-on-surface font-headline-sm text-headline-sm"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Companies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("salary-guide")}
              className={`px-space-md py-space-sm transition-colors rounded-lg ${
                activeTab === "salary-guide"
                  ? "bg-surface-container-high text-on-surface font-headline-sm text-headline-sm"
                  : "font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
            >
              Salary Guide
            </button>

            {/* Applicant Profile in Menu Bar */}
            {user && (
              <Link
                href="/dashboard/my-profile"
                className={`px-space-md py-space-sm transition-colors rounded-lg flex items-center gap-1.5 ${
                  pathname.startsWith("/dashboard")
                    ? "bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-sm"
                    : "font-body-md text-body-md text-primary hover:text-primary-container hover:bg-surface-container font-semibold"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_circle
                </span>
                <span>My Profile</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Global Search & User Profile Actions */}
        <div className="flex items-center gap-space-md">
          {/* Search trigger shortcut */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-space-sm px-space-md py-space-sm rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="font-body-sm text-body-sm pr-space-md">
              Search role, tech, location...
            </span>
            <kbd className="px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant">
              ⌘K
            </kbd>
          </button>

          {/* Icon actions */}
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="Saved Jobs"
              type="button"
              onClick={onOpenSaved}
              className="relative w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                bookmark
              </span>
              {savedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-on-primary font-label-sm text-[10px] flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              aria-label="Notifications"
              type="button"
              className="relative w-10 h-10 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                notifications
              </span>
              {showNotificationBadge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface-container-lowest"></span>
              )}
            </button>
          </div>

          {/* User profile capsule or Sign In button */}
          <div className="relative flex items-center gap-space-sm pl-space-sm border-l border-surface-container">
            {user ? (
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-space-sm p-1 pr-space-md rounded-full bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer select-none"
              >
                <img
                  alt={`${user.name} Profile`}
                  className="w-8 h-8 rounded-full object-cover border border-surface-container"
                  src={
                    user.image ||
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDCAFhTFfcq0WQSRKQhiq1Z5gW0fXxn9zl5-UYI_K4aaAjHhIxShHUAwL_CEpVNdCOWqsco46AH248pxpYCln9BHM4Xmxtrm6LZLX3Lq_O-Ox1-83wQAJD7gKGwa3JCI2F1ysCiM8451wlguJlW6oMXOBYSZzr8KiG8wHn5WnCM1cjdX7-0IRp9VTGmxM1q8TWYOb8a4jVEkINLX3jZLlojVAAGd9VdH5QKi6YJ3VQ"
                  }
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-headline-sm text-[13px] leading-tight text-on-surface font-semibold">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {user.role === "jobSeeker"
                        ? "JobSeeker Verified"
                        : user.role}
                    </span>
                  </div>
                </div>
                <span className="hidden lg:block material-symbols-outlined text-on-surface-variant text-[18px]">
                  expand_more
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-headline-sm text-[13px] font-medium transition-colors"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-space-md py-1.5 rounded-full bg-primary-container text-on-primary font-headline-sm text-[13px] font-semibold hover:bg-primary transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    login
                  </span>
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Dropdown Menu when user is logged in (Switch Account hidden) */}
            {user && showUserMenu && (
              <div className="absolute right-0 top-12 w-60 rounded-xl bg-surface-container-lowest shadow-xl border border-surface-container p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 border-b border-surface-container">
                  <p className="font-headline-sm text-headline-sm text-on-surface font-semibold truncate">
                    {user.name}
                  </p>
                  <p className="font-body-sm text-on-surface-variant truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold">
                    Candidate Profile
                  </span>
                </div>

                <Link
                  href="/dashboard/my-profile"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-body-sm hover:bg-surface-container text-on-surface flex items-center gap-2 mt-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    person
                  </span>
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-body-sm hover:bg-error-container text-error flex items-center gap-2 mt-1 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
