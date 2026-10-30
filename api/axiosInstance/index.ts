// API Client / Axios Instance
import { APP_CONFIG } from "@/config/constants";

export const API_BASE_URL = APP_CONFIG.apiUrl;

export interface ApiResponse<T = unknown> {
  status: boolean;
  message?: string;
  data?: T;
  user?: unknown;
  token?: string;
  error?: string;
  requireOtp?: boolean;
  email?: string;
}

export class ApiError extends Error {
  response?: {
    status: number;
    data: {
      status?: boolean;
      message?: string;
      requireOtp?: boolean;
      email?: string;
      error?: string;
    };
  };

  constructor(
    message: string,
    status?: number,
    data?: {
      status?: boolean;
      message?: string;
      requireOtp?: boolean;
      email?: string;
      error?: string;
    }
  ) {
    super(message);
    this.name = "ApiError";
    if (status !== undefined) {
      this.response = { status, data: data || {} };
    }
  }
}

export const fetcher = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody.message || `API error: ${response.status} ${response.statusText}`;
    throw new ApiError(message, response.status, errorBody);
  }

  return response.json();
};

export const axiosInstance = {
  get: <T = unknown>(url: string, init?: RequestInit) =>
    fetcher<T>(url, { method: "GET", ...init }),
  post: <T = unknown>(url: string, data?: unknown, init?: RequestInit) =>
    fetcher<T>(url, {
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...init,
    }),
  put: <T = unknown>(url: string, data?: unknown, init?: RequestInit) =>
    fetcher<T>(url, {
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
      ...init,
    }),
  delete: <T = unknown>(url: string, init?: RequestInit) =>
    fetcher<T>(url, { method: "DELETE", ...init }),
};

export default axiosInstance;
