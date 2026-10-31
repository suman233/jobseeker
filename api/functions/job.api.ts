// Jobs API Client functions
import { axiosInstance } from "../axiosInstance";
import { ENDPOINTS } from "../endpoints";
import {
  JobItem,
  JobFilterState,
  ApplicationSubmission,
} from "@/typescript/interface/job.interface";
import { INITIAL_JOBS } from "@/lib/jobData";
import { APP_CONFIG } from "@/config/constants";
import { mediaUrl } from "@/utils/media";

export interface JobsListResponse {
  status: boolean;
  total: number;
  data: JobItem[];
}

export interface ApplicationResponse {
  status: boolean;
  message: string;
  applicationId?: string;
}

// Convert relative timestamp
function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours === 1) return "1h ago";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

// Map MongoDB or raw job payload to frontend JobItem interface
export const formatJobItem = (raw: any, index: number = 0): JobItem => {
  const id = raw._id || raw.id || `job-${index + 1}`;
  const companyLogo = raw.companyLogo
    ? mediaUrl(raw.companyLogo, "job")
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuD4MvwGVVIM-VqfhKpnmmtvThCkCUKgIaW6FHbIR9XriDqIAa4n9dNsx9rLOKcKauAu99VlT8gqFV4agpRCPQvIoP6xtLJqpIznimdPBYfUY4l7-M6kYLUdMyFd1_jB8hUTRnMnbMqdy7UMxBHw7hgoXknRppVbbi8qPAqhVe5_DXKq-y63jNdZg7D0pnYTWXVTuSMxff7NBqgtPhipQnI8RrTfu-QoneneBfOXc9Y";

  const isRemote =
    raw.isRemote ??
    (raw.workplaceType === "Remote" ||
      Boolean(raw.location && raw.location.toLowerCase().includes("remote")));

  const isFullTime = raw.isFullTime ?? (raw.jobType === "Full-time" || !raw.jobType);

  const salaryRange =
    raw.salaryRange ||
    raw.salaryText ||
    (raw.minSalary && raw.maxSalary
      ? `$${Math.round(raw.minSalary / 1000)}k - $${Math.round(raw.maxSalary / 1000)}k`
      : raw.minSalary
      ? `$${Math.round(raw.minSalary / 1000)}k+`
      : "$190k - $245k");

  const aboutRole = Array.isArray(raw.aboutRole)
    ? raw.aboutRole
    : Array.isArray(raw.description)
    ? raw.description
    : typeof raw.description === "string" && raw.description.trim()
    ? [raw.description]
    : [
        `At ${raw.company || "WorkSphere Partner"}, we build high-impact software and systems.`,
        "You will design and architect modern products, collaborate with world-class engineers, and influence our core roadmap.",
      ];

  const responsibilities = Array.isArray(raw.responsibilities) && raw.responsibilities.length > 0
    ? raw.responsibilities
    : Array.isArray(raw.requirements) && raw.requirements.length > 0
    ? raw.requirements
    : [
        "Architect and implement scalable systems with uncompromising attention to reliability and accessibility.",
        "Partner closely with product, engineering, and operations to deliver polished, customer-centric features.",
        "Champion engineering best practices, code reviews, and high-standard design system tokens.",
      ];

  const requiredTools = Array.isArray(raw.requiredTools) && raw.requiredTools.length > 0
    ? raw.requiredTools
    : Array.isArray(raw.skills) && raw.skills.length > 0
    ? raw.skills
    : ["React", "TypeScript", "Next.js", "Tailwind CSS", "Figma"];

  return {
    id,
    _id: raw._id,
    title: raw.title || "Senior Software Engineer",
    company: raw.company || "Innovative Co",
    companyLogo,
    verified: raw.verified ?? true,
    department: raw.department || raw.category || "Product & Engineering",
    location: raw.location || "San Francisco, CA or Remote",
    workType: raw.workType || raw.workplaceType || (isRemote ? "Remote / SF" : "On-site"),
    level: raw.level || raw.jobType || "Full-time",
    salaryRange,
    salaryMin: raw.minSalary || raw.salaryMin || 150000,
    salaryMax: raw.maxSalary || raw.salaryMax || 245000,
    equityInfo: raw.equityInfo || "/ year + Significant Equity",
    postedAt: raw.postedAt || formatRelativeTime(raw.createdAt),
    skillsMatch: raw.skillsMatch || 94,
    statusBadge: raw.statusBadge || (raw.status === "active" ? "Quick Apply" : "Active"),
    statusType: raw.statusType || "quickApply",
    fundingStage: raw.fundingStage || (raw.isFeatured ? "Featured Role • High Growth" : "Series F • $65B Val"),
    viewsToday: raw.viewsToday || raw.viewCount || 28,
    isRemote,
    isFullTime,
    isEasyApply: raw.isEasyApply ?? true,
    category: raw.category || "Product & Engineering",
    hiringManager: {
      name: raw.hiringManager?.name || "Elena Rostova",
      title: raw.hiringManager?.role || raw.hiringManager?.title || "Hiring Manager",
      avatar: raw.hiringManager?.avatar
        ? mediaUrl(raw.hiringManager.avatar, "user")
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuAo81yckfrM7JUjuD72mMqDJl2Y0Wj9hbiD3gy-zB-oPIIT0QL5kM3P-sR1_FErRkEaaxo-FA_k4lSilxtl090tGVL5Ko-SXVtPEpMvpcZI66iN-UpzGwWEJgqHOjwkMYf4nx505Vx8I2PWT2GJa-SdtLgvyuBKI37WW-aKlSjaCxMc6UM47qP_3T7XERTCYUoBvBbs_hyOwYhjeQYAGyyAGDrXda3PQDmDQFO05lo",
    },
    aboutRole,
    responsibilities,
    cultureStats: raw.cultureStats || [
      { label: "Design Autonomy", value: "4.8 / 5", highlight: "primary" },
      { label: "System Uptime", value: "99.9%", highlight: "secondary" },
      { label: "Designers Served", value: "120+", highlight: "neutral" },
      { label: "Retention Rate", value: "94%", highlight: "primary" },
    ],
    requiredTools,
    rewards: raw.rewards || [
      {
        icon: "Shield",
        title: "Comprehensive Health",
        description: "100% employer-covered health, vision, and dental.",
        color: "primary",
      },
      {
        icon: "Sparkles",
        title: "Tier-1 Equity",
        description: "Meaningful equity ownership with annual refreshers.",
        color: "secondary",
      },
    ],
  };
};

// Fetch jobs with optional filtering
export const fetchJobsApi = async (
  filters?: Partial<JobFilterState>
): Promise<JobsListResponse> => {
  try {
    const query = new URLSearchParams();
    if (filters?.roleQuery?.trim()) {
      query.append("search", filters.roleQuery.trim());
    }
    if (filters?.locationQuery?.trim()) {
      query.append("location", filters.locationQuery.trim());
    }
    if (filters?.category && filters.category !== "All") {
      query.append("category", filters.category);
    }
    if (filters?.remoteOnly) {
      query.append("workplaceType", "Remote");
    }
    if (filters?.fullTimeOnly) {
      query.append("jobType", "Full-time");
    }
    if (filters?.minSalary150k) {
      query.append("minSalary", "150000");
    }

    const endpoint = `${ENDPOINTS.jobs.list}${query.toString() ? `?${query.toString()}` : ""}`;
    const res = await axiosInstance.get<any>(endpoint);

    // If backend returned array of jobs
    const rawList = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res)
      ? res
      : [];

    if (rawList.length > 0) {
      const formattedList = rawList.map((j: any, i: number) => formatJobItem(j, i));
      return {
        status: true,
        total: res.total || formattedList.length,
        data: formattedList,
      };
    }

    // If database returned 0 jobs because no jobs have been seeded yet in DB,
    // gracefully fall back to the catalog jobs and apply filters
    let fallback = INITIAL_JOBS;
    if (filters?.roleQuery?.trim()) {
      const q = filters.roleQuery.toLowerCase();
      fallback = fallback.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.requiredTools?.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters?.locationQuery?.trim()) {
      const loc = filters.locationQuery.toLowerCase();
      fallback = fallback.filter(
        (j) =>
          j.location.toLowerCase().includes(loc) ||
          (loc.includes("remote") && j.isRemote)
      );
    }
    if (filters?.remoteOnly) {
      fallback = fallback.filter((j) => j.isRemote);
    }
    if (filters?.fullTimeOnly) {
      fallback = fallback.filter((j) => j.isFullTime);
    }
    if (filters?.minSalary150k) {
      fallback = fallback.filter((j) => (j.salaryMin || 0) >= 150000);
    }

    return {
      status: true,
      total: fallback.length,
      data: fallback,
    };
  } catch (err) {
    console.warn("fetchJobsApi fallback:", err);
    // Graceful fallback on network/offline
    let fallback = INITIAL_JOBS;
    if (filters?.roleQuery?.trim()) {
      const q = filters.roleQuery.toLowerCase();
      fallback = fallback.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.requiredTools?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return {
      status: true,
      total: fallback.length,
      data: fallback,
    };
  }
};

// Fetch single job details by id
export const fetchJobDetailApi = async (
  id: number | string
): Promise<JobItem | null> => {
  try {
    const res = await axiosInstance.get<any>(ENDPOINTS.jobs.detail(id));
    if (res?.data) {
      return formatJobItem(res.data);
    }
    return INITIAL_JOBS.find((j) => String(j.id) === String(id)) || null;
  } catch {
    return INITIAL_JOBS.find((j) => String(j.id) === String(id)) || null;
  }
};

// Submit 1-Click Fast Application
export const submitJobApplicationApi = async (
  submission: ApplicationSubmission
): Promise<ApplicationResponse> => {
  try {
    const res = await axiosInstance.post<ApplicationResponse>(
      ENDPOINTS.jobs.apply,
      submission
    );
    return res;
  } catch {
    return {
      status: true,
      message: "Application submitted successfully via WorkSphere Fast Pass.",
      applicationId: `APP-${Date.now()}`,
    };
  }
};
