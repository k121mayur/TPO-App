
export enum UserRole {
  EMPLOYEE = 'employee',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

export enum WorkType {
  REMOTE = 'Remote',
  HYBRID = 'Hybrid',
  ON_SITE = 'On-site',
}

export enum JobSector {
  RENEWABLE_ENERGY = 'Renewable Energy',
  SUSTAINABILITY_CONSULTING = 'Sustainability Consulting',
  CONSERVATION = 'Conservation',
  ESG = 'ESG',
  NON_PROFIT = 'Non-Profit',
  GREEN_TECH = 'Green Tech',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  profile?: EmployeeProfile;
  companyId?: string;
}

export interface EmployeeProfile {
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  resumeUrl?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  gradYear: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  isVerified: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  sector: JobSector;
  workType: WorkType;
  salaryRange: [number, number];
  postedDate: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  isThirdParty?: boolean;
  redirectUrl?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  role: UserRole;
  companyId?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface JobFilters {
  title?: string;
  location?: string;
  sector?: JobSector;
  workType?: WorkType;
}

export interface RedirectStat {
  jobId: string;
  jobTitle: string;
  clicks: number;
}

export interface AdminStats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  redirects: RedirectStat[];
}
