
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getJobs } from '../services/api';
import { Job, WorkType, JobSector } from '../types';
import JobCard from '../components/jobs/JobCard';
import { Search, MapPin, Briefcase, SlidersHorizontal } from 'lucide-react';

const JobsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    title: searchParams.get('title') || '',
    location: searchParams.get('location') || '',
    workType: searchParams.get('workType') || '',
    sector: searchParams.get('sector') || '',
  });
  
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const results = await getJobs(filters);
    setJobs(results);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (filters.title) newParams.set('title', filters.title);
    if (filters.location) newParams.set('location', filters.location);
    if (filters.workType) newParams.set('workType', filters.workType);
    if (filters.sector) newParams.set('sector', filters.sector);
    setSearchParams(newParams);
    fetchJobs();
  };


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                 <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="title" id="title" value={filters.title} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green" placeholder="e.g. ESG Analyst" />
                 </div>
            </div>
            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                 <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" name="location" id="location" value={filters.location} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green" placeholder="e.g. Remote" />
                 </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <div>
                     <label htmlFor="workType" className="block text-sm font-medium text-gray-700">Work Type</label>
                     <select id="workType" name="workType" value={filters.workType} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md">
                         <option value="">All</option>
                         {Object.values(WorkType).map(wt => <option key={wt} value={wt}>{wt}</option>)}
                     </select>
                </div>
                 <div>
                     <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector</label>
                     <select id="sector" name="sector" value={filters.sector} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md">
                         <option value="">All</option>
                         {Object.values(JobSector).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                 </div>
            </div>
            <button type="submit" className="w-full bg-brand-green text-white py-2 px-4 rounded-md hover:bg-brand-green-light transition duration-300 shadow-sm flex items-center justify-center gap-2">
                <Search size={18} /> Search
            </button>
        </form>
      </div>

      <div>
        {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                ))}
            </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700">No jobs found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
