
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getEmployerJobs, getCompanyById } from '../services/api';
import { Job, Company } from '../types';
import { Plus, Edit, Trash2, ShieldCheck, ExternalLink, Briefcase, Eye } from 'lucide-react';

const EmployerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // @ts-ignore - 'companyId' is a mock property on employer user
        const companyId = user.companyId;
        const [employerJobs, companyData] = await Promise.all([
          getEmployerJobs(user.id),
          getCompanyById(companyId),
        ]);
        setJobs(employerJobs);
        setCompany(companyData || null);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading || !user || !company) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-green"></div></div>;
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
                    <div className="flex items-center gap-2 text-lg text-gray-600 mt-1">
                        <span>{company.name}</span>
                        {company.isVerified ? 
                         <span className="flex items-center gap-1 text-sm text-blue-600"><ShieldCheck size={16} /> Verified</span> :
                         <button className="text-sm text-orange-600 hover:underline">Request Verification</button>
                        }
                    </div>
                </div>
                <button className="mt-4 md:mt-0 bg-brand-green text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:bg-brand-green-light transition-colors shadow-sm">
                    <Plus size={20} /> Post a New Job
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Your Job Postings</h2>
                <div className="space-y-4">
                    {jobs.length > 0 ? jobs.map(job => (
                        <div key={job.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50 transition-colors">
                            <div>
                                <h3 className="font-bold text-lg text-brand-green-dark">{job.title}</h3>
                                <p className="text-sm text-gray-500">{job.location} &bull; {job.workType}</p>
                            </div>
                            <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full"><Eye size={18}/></button>
                                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-100 rounded-full"><Edit size={18}/></button>
                                <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <Briefcase size={48} className="mx-auto text-gray-300"/>
                            <p className="mt-4 text-gray-500">You haven't posted any jobs yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
