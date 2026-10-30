"use client";

import React, { useState } from "react";
import { JobItem } from "@/typescript/interface/job.interface";

interface ApplyModalProps {
  job: JobItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: JobItem, note: string) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onSubmit(job, note);
      setTimeout(() => {
        setIsSuccess(false);
        setNote("");
        onClose();
      }, 1500);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-space-md bg-inverse-surface/60 backdrop-blur-sm transition-opacity duration-200"
    >
      <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-2xl relative border border-surface-container animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-space-md border-b-0">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                1-Click Fast Apply
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant" id="modalRoleSubtitle">
                {job.company} • {job.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="py-space-xl text-center space-y-space-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">check</span>
            </div>
            <h4 className="font-headline-md text-on-surface font-semibold">
              Application Submitted!
            </h4>
            <p className="font-body-sm text-on-surface-variant">
              Your profile and credentials were successfully transmitted to {job.hiringManager.name}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-space-md my-space-lg">
              {/* Verified Resume Card */}
              <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-surface-container">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[28px]">
                    description
                  </span>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      Alex_Morgan_Resume_2025.pdf
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Verified by WorkSphere • Updated 3 days ago
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-primary font-label-sm text-label-sm font-semibold hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Hiring Manager Note */}
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mb-1">
                  Quick Note to {job.hiringManager.name} ({job.hiringManager.title.split("•")[0].trim()})
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Introduce yourself or highlight specific design systems or infrastructure projects you led..."
                  className="w-full bg-surface-container-low rounded-lg p-space-sm font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:bg-surface-container transition-all border border-surface-container"
                />
              </div>

              {/* Security & Discretion Badge */}
              <div className="flex items-center gap-space-sm bg-secondary-fixed/50 p-space-sm rounded-lg border border-secondary-fixed">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  lock
                </span>
                <p className="font-body-sm text-body-sm text-on-secondary-fixed font-medium">
                  Your contact details and discretion flags remain fully protected.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-space-sm pt-space-sm border-t border-surface-container">
              <button
                type="button"
                onClick={onClose}
                className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-headline-sm text-headline-sm hover:bg-surface-container-high transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-space-xl py-2 bg-primary-container text-on-primary rounded-lg font-headline-sm text-headline-sm flex items-center gap-space-xs hover:bg-primary transition-all font-semibold disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
                <span>{isSubmitting ? "Submitting..." : "Submit Application"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;

