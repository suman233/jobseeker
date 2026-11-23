export interface HiringManager {
  name: string;
  title: string;
  avatar: string;
}

export interface CultureBenchmark {
  label: string;
  value: string;
  highlight?: "primary" | "secondary" | "neutral";
}

export interface RewardPerk {
  icon: string;
  title: string;
  description: string;
  color?: "primary" | "secondary";
}

export interface JobItem {
  id: number | string;
  _id?: string;
  title: string;
  company: string;
  companyLogo: string;
  verified: boolean;
  department: string;
  location: string;
  workType: string;
  level: string;
  salaryRange: string;
  salaryMin: number;
  salaryMax: number;
  salaryText?: string;
  equityInfo?: string;
  postedAt: string;
  skillsMatch: number;
  statusBadge?: string;
  statusType?: "quickApply" | "applicants" | "reviewing" | "verifiedSalary";
  applicantsCount?: number;
  fundingStage?: string;
  viewsToday?: number;
  hiringManager: HiringManager;
  aboutRole: string[];
  responsibilities: string[];
  cultureStats: CultureBenchmark[];
  requiredTools: string[];
  rewards: RewardPerk[];
  isRemote: boolean;
  isFullTime: boolean;
  isEasyApply: boolean;
  category: string;
  createdAt?: string;
}

export interface JobFilterState {
  roleQuery: string;
  locationQuery: string;
  radius: string;
  remoteOnly: boolean;
  fullTimeOnly: boolean;
  minSalary150k: boolean;
  category: string;
  easyApplyOnly: boolean;
  sortBy: "relevancy" | "recent" | "comp" | "urgent";
}

export interface ApplicationSubmission {
  jobId: number | string;
  jobTitle?: string;
  company?: string;
  applicantName?: string;
  applicantEmail?: string;
  resumeFileName?: string;
  note?: string;
}

export interface JobApplication {
  _id: string;
  job: JobItem | string;
  user?: string;
  applicantName: string;
  applicantEmail: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location?: string;
  salaryRange?: string;
  jobType?: string;
  note?: string;
  status: "Submitted" | "Under Review" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  createdAt?: string;
}

