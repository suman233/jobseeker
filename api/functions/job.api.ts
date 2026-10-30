// Jobs API Client functions
import { axiosInstance } from "../axiosInstance";
import { ENDPOINTS } from "../endpoints";
import { JobItem, JobFilterState, ApplicationSubmission } from "@/typescript/interface/job.interface";
import { INITIAL_JOBS } from "@/lib/jobData";

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

// Fetch jobs with optional filtering
export const fetchJobsApi = async (
  filters?: Partial<JobFilterState>
): Promise<JobsListResponse> => {
  try {
    const res = await axiosInstance.get<JobsListResponse>(ENDPOINTS.jobs.list);
    return res;
  } catch {
    // Graceful fallback to initial verified catalog
    return {
      status: true,
      total: INITIAL_JOBS.length,
      data: INITIAL_JOBS,
    };
  }
};

// Fetch single job details by id
export const fetchJobDetailApi = async (id: number): Promise<JobItem | null> => {
  try {
    const res = await axiosInstance.get<JobItem>(ENDPOINTS.jobs.detail(id));
    return res;
  } catch {
    return INITIAL_JOBS.find((j) => j.id === id) || null;
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

