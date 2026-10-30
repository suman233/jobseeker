"use client";

import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl font-bold">
        !
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-900">Something went wrong!</h2>
      <p className="text-sm text-gray-600 mb-6 max-w-sm">
        We encountered an unexpected error while loading this page.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
