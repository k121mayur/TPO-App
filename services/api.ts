import { AdminStats, AuthResponse, Company, EmployeeProfile, Job, JobFilters, LoginData, RegisterData, User } from '../types';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/$/, '');

let accessToken: string | null = null;

interface RequestOptions {
  method?: string;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  path: string;
}

const buildUrl = (path: string, params?: RequestOptions['params']) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${BASE_URL}${normalizedPath}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  return headers;
};

const request = async <T>({ path, method = 'GET', params, body }: RequestOptions): Promise<T> => {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const message =
      (payload as any)?.detail || (payload as any)?.message || response.statusText || 'Something went wrong';
    throw new Error(message);
  }
  return payload as T;
};

export const setAccessToken = (token: string | null) => {
  accessToken = token ?? null;
};

export const login = (payload: LoginData): Promise<AuthResponse> => {
  return request<AuthResponse>({ path: '/auth/login', method: 'POST', body: payload });
};

export const register = (payload: RegisterData): Promise<AuthResponse> => {
  const { companyId, ...rest } = payload;
  return request<AuthResponse>({
    path: '/auth/register',
    method: 'POST',
    body: { ...rest, company_id: companyId },
  });
};

export const getCurrentUser = (): Promise<User> => {
  return request<User>({ path: '/auth/me' });
};

export const getJobs = (filters: JobFilters): Promise<Job[]> => {
  return request<Job[]>({ path: '/jobs', params: filters });
};

export const getFeaturedJobs = (): Promise<Job[]> => {
  return request<Job[]>({ path: '/jobs/featured' });
};

export const getJobById = (id: string): Promise<Job> => {
  return request<Job>({ path: `/jobs/${id}` });
};

export const trackRedirect = (jobId: string): Promise<void> => {
  return request({ path: `/jobs/${jobId}/track-redirect`, method: 'POST' });
};

export const getCompanyById = (id: string): Promise<Company> => {
  return request<Company>({ path: `/companies/${id}` });
};

export const getEmployerJobs = (): Promise<Job[]> => {
  return request<Job[]>({ path: '/employer/jobs' });
};

export const getAdminStats = (): Promise<AdminStats> => {
  return request<AdminStats>({ path: '/admin/stats' });
};

export const updateProfile = (payload: Partial<EmployeeProfile>) => {
  return request<User>({ path: '/auth/profile', method: 'PUT', body: payload });
};
