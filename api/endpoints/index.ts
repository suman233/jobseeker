// API Endpoints constants
export const ENDPOINTS = {
  auth: {
    login: "/api/user-login",
    register: "/api/user-register",
    profile: "/api/user-profile",
    verifyOtp: "/api/verify-otp",
    resendOtp: "/api/resend-otp",
  },
  jobs: {
    list: "/api/jobs",
    detail: (id: number | string) => `/api/jobs/${id}`,
    apply: "/api/jobs/apply",
  },
  admin: {
    login: "/admin/login",
    register: "/admin/register",
    employerList: "/employer",
    jobSeekerList: "/job-seeker",
  },
  health: "/health",
};

export default ENDPOINTS;
