"use client";

import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.03)] mt-auto border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-xl mb-space-xl">
          {/* Brand Intro & System Status */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-space-sm mb-space-md">
              <img
                alt="WorkSphere Logo"
                className="h-6 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1Uvn_q5sMy6ZFlruW4qTx3MUU0DgKXJb3-GrOKP1u92HxxUoXSF6FcKU9LwEVAX0plxGfq90R6IEmEaTYZT8o5tjIMlNwQqRZRzp9w526wNddubsHU3y2csTc7vuG1Rj74eJG_dYbXU3gavTSYDmdDpqABqX4GonMoZ15AuLk3nT-WjEDKGzhArW0lPSVD0SlaSAtVSgEbnbaEAEQCJJrnmwGTMw9y_LY1qLwGNDoo"
              />
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                WorkSphere
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
              Authoritative career infrastructure for high-growth tech talent,
              executives, and forward-thinking engineering organizations.
            </p>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container-low border border-surface-container">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm text-on-surface font-medium">
                Systems Operational
              </span>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">
              Career Discovery
            </h4>
            <ul className="space-y-space-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Software Engineering
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Machine Learning & AI
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Product Leadership
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Remote-First Roles
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">
              Candidate Intelligence
            </h4>
            <ul className="space-y-space-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Verified Compensation Index
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Tech Stack Market Pulse
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Interview Trajectory Map
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Executive Placement Desk
              </li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-semibold">
              Platform & Trust
            </h4>
            <ul className="space-y-space-sm">
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Privacy & Discretion Protocol
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Verified Hiring Standards
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Security Compliance
              </li>
              <li className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
                Engineering Support
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal pill banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-space-lg bg-surface-container-low px-space-lg py-space-md rounded-xl gap-space-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2026 WorkSphere Technologies Inc. Built for institutional reliability.
          </p>
          <div className="flex items-center gap-space-lg">
            <Link
              href="/privacy-policy"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Candidate Privacy
            </Link>
            <span className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">
              Security Portal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
