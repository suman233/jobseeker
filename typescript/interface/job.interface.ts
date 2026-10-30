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
  id: number;
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
  jobId: number;
  jobTitle: string;
  company: string;
  resumeFileName: string;
  note: string;
}

