
import { mockJobs, mockCompanies, mockUsers, mockAdminStats } from './mockData';
import { Job, User, UserRole, Company } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getJobs = async (filters: any): Promise<Job[]> => {
  await delay(500);
  console.log("Filtering with:", filters);
  // Basic filtering simulation
  return mockJobs.filter(job => {
    const titleMatch = filters.title ? job.title.toLowerCase().includes(filters.title.toLowerCase()) : true;
    const locationMatch = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
    const sectorMatch = filters.sector ? job.sector === filters.sector : true;
    const workTypeMatch = filters.workType ? job.workType === filters.workType : true;
    return titleMatch && locationMatch && sectorMatch && workTypeMatch;
  });
};

export const getJobById = async (id: string): Promise<Job | undefined> => {
    await delay(300);
    return mockJobs.find(job => job.id === id);
}

export const getFeaturedJobs = async (): Promise<Job[]> => {
    await delay(300);
    return mockJobs.slice(0, 4);
}

export const getMockUser = (role: UserRole): User => {
    return mockUsers[role];
}

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
    await delay(200);
    return mockCompanies.find(c => c.id === id);
}

export const getEmployerJobs = async (employerId: string): Promise<Job[]> => {
    await delay(500);
    const employerCompanyId = mockUsers.employer.companyId;
    return mockJobs.filter(job => job.company.id === employerCompanyId);
}

export const getAdminStats = async () => {
    await delay(600);
    return mockAdminStats;
}

export const trackRedirect = async (jobId: string) => {
    await delay(100);
    console.log(`Redirect tracked for job ${jobId}`);
    // In a real app, this would be an API call to the backend.
    const stat = mockAdminStats.redirects.find(r => r.jobId === jobId);
    if(stat){
        stat.clicks += 1;
    } else {
        const job = mockJobs.find(j => j.id === jobId);
        if(job) {
             mockAdminStats.redirects.push({ jobId: job.id, jobTitle: job.title, clicks: 1});
        }
    }
    return Promise.resolve();
}
