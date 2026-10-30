"use client";

import React, { useState } from "react";
import { JobItem } from "@/typescript/interface/job.interface";
import { Zap, X, CheckCircle2 } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Zap size={18} className="fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                1-Click Fast Apply
              </h3>
              <p className="text-xs text-gray-500" id="modalRoleSubtitle">
                {job.company} • {job.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-base font-bold text-gray-900">
              Application Submitted!
            </h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Your verified profile and credentials have been delivered directly to{" "}
              <strong>{job.hiringManager.name}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-700">
              <span className="font-medium">Verified Profile Delivery</span>
              <span className="font-bold text-emerald-700">Instant</span>
            </div>

            <div>
              <label
                htmlFor="applyNote"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Direct Note to Hiring Manager (Optional)
              </label>
              <textarea
                id="applyNote"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share a concise highlights overview relevant to this team..."
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white text-xs resize-none transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} className="fill-current" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;
