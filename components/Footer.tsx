"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200/80 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Intro & System Status */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase size={14} className="stroke-[2.5]" />
              </div>
              <span className="text-base font-bold text-gray-900">
                WorkSphere
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Authoritative career infrastructure for high-growth tech talent,
              executives, and forward-thinking engineering organizations.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-gray-700 font-semibold">
                Systems Operational
              </span>
            </div>
          </div>

          {/* Column 1: Career Discovery */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Career Discovery
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Software Engineering
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Machine Learning & AI
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Product Leadership
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Remote-First Roles
              </li>
            </ul>
          </div>

          {/* Column 2: Candidate Intelligence */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Candidate Intelligence
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Verified Compensation Index
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Tech Stack Market Pulse
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Interview Trajectory Map
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Executive Placement Desk
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Platform & Trust
            </h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Privacy & Discretion Protocol
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Verified Hiring Standards
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Security Compliance
              </li>
              <li className="hover:text-gray-900 cursor-pointer transition-colors">
                Engineering Support
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal links */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-gray-100 text-xs text-gray-400 gap-3">
          <p>© 2025 WorkSphere Technologies Inc. Built for institutional reliability.</p>
          <p className="creator-credit">
            <span className="creator-line"></span>
            Crafted with <span className="heart">♥</span> by
            <a href="#" className="creator-name hover:text-gray-600 transition-colors"> SK</a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">
              Candidate Privacy
            </Link>
            <Link href="/help" className="hover:text-gray-600 transition-colors">
              Security Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
