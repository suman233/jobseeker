// User API functions
import { axiosInstance } from "../axiosInstance";
import { ENDPOINTS } from "../endpoints";

export interface LoginPayload {
  email: string;
  password?: string;
  name?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  role?: "jobSeeker" | "employer";
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  isEmailVerified?: boolean;
  frontendUser?: boolean;
  createdAt?: string;
}

export interface UserResponse {
  status: boolean;
  message: string;
  user?: UserProfile;
  token?: string;
  requireOtp?: boolean;
  email?: string;
  error?: string;
}

// Login API - checks credentials and verifies email validation status
export const loginUserApi = async (
  credentials: LoginPayload
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.login, credentials);
};

// Register API - creates a candidate profile with OTP generation
export const registerUserApi = async (
  payload: RegisterPayload
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.register, payload);
};

// Verify OTP API - verifies candidate email OTP and returns token
export const verifyOtpApi = async (
  payload: VerifyOtpPayload
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.verifyOtp, payload);
};

// Resend OTP API - sends a fresh OTP to the candidate email
export const resendOtpApi = async (
  payload: ResendOtpPayload
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.resendOtp, payload);
};

// Send OTP to email for pre-registration verification
export const sendEmailOtpApi = async (
  payload: { email: string }
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.sendEmailOtp, payload);
};

// Verify pre-registration email OTP
export const verifyEmailOtpApi = async (
  payload: { email: string; otp: string }
): Promise<UserResponse> => {
  return axiosInstance.post<UserResponse>(ENDPOINTS.auth.verifyEmailOtp, payload);
};

// Get current profile using bearer token
export const fetchUserProfileApi = async (
  token: string
): Promise<{ status: boolean; user?: UserProfile }> => {
  return axiosInstance.get<{ status: boolean; user?: UserProfile }>(
    ENDPOINTS.auth.profile,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


