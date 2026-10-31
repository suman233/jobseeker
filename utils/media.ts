export const baseUrlMedia =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.trim() : "") ||
  "https://jobseeker-backend-u7lc.onrender.com";

/**
 * Resolves an image filename or path to the full live backend media URL.
 * Supported URL structures:
 * - https://jobseeker-backend-u7lc.onrender.com/uploads/job/1793398098222.jpeg
 * - https://jobseeker-backend-u7lc.onrender.com/uploads/user/1793398098222.jpeg
 *
 * @param url Stored raw filename (e.g. '1793398098222.jpeg'), relative path, or remote URL
 * @param type Target folder category ('job' for company logos, 'user' for candidate/employer photos)
 */
export const mediaUrl = (
  url?: string | null,
  type: "job" | "user" = "job"
): string => {
  if (!url) return "";
  const trimmed = String(url).trim();
  if (!trimmed) return "";

  // If already an absolute remote URL or data URI, return directly
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  const base = (
    baseUrlMedia || "https://jobseeker-backend-u7lc.onrender.com"
  ).replace(/\/+$/, "");

  const clean = trimmed.replace(/\\/g, "/").replace(/^\/+/, "");

  // If already has uploads/user/ or uploads/job/ prefix
  if (clean.startsWith("uploads/user/") || clean.startsWith("uploads/job/")) {
    return `${base}/${clean}`;
  }

  // If prefixed with generic uploads/<filename>
  if (clean.startsWith("uploads/")) {
    const filename = clean.replace(/^uploads\//, "");
    return `${base}/uploads/${type}/${filename}`;
  }

  // Stored raw filename (e.g. '1793398098222.jpeg')
  return `${base}/uploads/${type}/${clean}`;
};
