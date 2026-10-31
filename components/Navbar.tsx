"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/api/functions/user.api";
import { useAuth } from "@/hooks/useAuth";
import { mediaUrl } from "@/utils/media";
import {
  Search,
  Bookmark,
  Bell,
  User,
  ChevronDown,
  LogOut,
  LogIn,
  Menu,
  X,
  Briefcase,
} from "lucide-react";

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
  const { user: storeUser, logout: storeLogout } = useAuth();
  const user = propUser || storeUser;

  const [activeTab, setActiveTab] = useState("find-jobs");
  const [showNotificationBadge] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    if (propLogout) {
      propLogout();
    } else {
      storeLogout();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Briefcase size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 font-sans">
              WorkSphere
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              onClick={() => setActiveTab("find-jobs")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "find-jobs" && pathname === "/"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Find Jobs
            </Link>
            <button
              type="button"
              onClick={() => setActiveTab("applied-tracker")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "applied-tracker"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Applied Tracker
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("companies")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "companies"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Companies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("salary-guide")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "salary-guide"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Salary Guide
            </button>
          </nav>
        </div>

        {/* Right Actions Toolbar */}
        <div className="flex items-center gap-3">
          {/* Quick Search Bar Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors text-xs font-medium cursor-pointer"
          >
            <Search size={15} />
            <span className="pr-4 text-gray-500">
              Search role, tech, location...
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] text-gray-500 font-mono shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Action Icon Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Saved Jobs"
              onClick={onOpenSaved}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Bookmark size={19} />
              {savedCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Bell size={19} />
              {showNotificationBadge && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          {/* User Profile Chip or Login/Register */}
          <div className="relative">
            {user ? (
              <div
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors cursor-pointer select-none border border-transparent hover:border-gray-200"
              >
                <img
                  alt={`${user.name} Avatar`}
                  src={
                    mediaUrl(user.image, "user") ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80"
                  }
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80";
                  }}
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-900 leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      Actively Looking
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <LogIn size={14} />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Profile Menu Dropdown */}
            {user && showUserMenu && (
              <div className="absolute right-0 top-12 w-56 rounded-xl bg-white shadow-lg border border-gray-100 p-1.5 z-50">
                <div className="p-2.5 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {user.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                    Verified Candidate
                  </span>
                </div>

                <Link
                  href="/dashboard/my-profile"
                  onClick={() => setShowUserMenu(false)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-gray-50 text-gray-700 flex items-center gap-2 mt-1 font-medium transition-colors"
                >
                  <User size={15} className="text-indigo-600" />
                  <span>My Profile</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-red-50 text-red-600 flex items-center gap-2 mt-1 font-medium transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Find Jobs
          </Link>
          <button
            type="button"
            onClick={() => {
              setActiveTab("applied-tracker");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Applied Tracker
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("companies");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Companies
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("salary-guide");
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Salary Guide
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
