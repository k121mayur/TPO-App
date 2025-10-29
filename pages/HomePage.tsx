
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase } from 'lucide-react';
import JobCard from '../components/jobs/JobCard';
import { Job } from '../types';
import { getFeaturedJobs } from '../services/api';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const jobs = await getFeaturedJobs();
      setFeaturedJobs(jobs);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/jobs?title=${title}&location=${location}`);
  };

  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative bg-brand-green-dark text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: 'url(https://picsum.photos/seed/hero/1920/1080)'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Find Your Purpose.</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">Your career in sustainability, ESG, and non-profit starts here.</p>
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Job title or keyword"
                className="w-full bg-transparent pl-12 pr-4 py-3 text-gray-800 focus:outline-none"
              />
            </div>
            <div className="relative md:border-l md:border-gray-200">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or remote"
                className="w-full bg-transparent pl-12 pr-4 py-3 text-gray-800 focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full md:w-auto bg-brand-green hover:bg-brand-green-light transition-all duration-300 text-white font-bold py-3 px-8 rounded-full flex items-center justify-center gap-2">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Featured Job Openings</h2>
          {loading ? (
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                ))}
             </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
