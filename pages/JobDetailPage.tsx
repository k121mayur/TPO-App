
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobById, trackRedirect } from '../services/api';
import { Job } from '../types';
import { MapPin, Briefcase, DollarSign, Clock, ExternalLink, ArrowLeft, Building, ShieldCheck, CheckSquare, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        setLoading(true);
        const jobData = await getJobById(id);
        setJob(jobData || null);
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (job?.isThirdParty && job.redirectUrl) {
      trackRedirect(job.id);
      window.open(job.redirectUrl, '_blank');
    } else {
        alert("Thank you for your application! (This is a mock application process)");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-green"></div></div>;
  }

  if (!job) {
    return <div className="text-center py-20">Job not found.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/jobs" className="flex items-center gap-2 text-brand-green-dark hover:underline mb-8">
          <ArrowLeft size={18} /> Back to all jobs
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-6 mb-6">
              <img src={job.company.logo} alt={job.company.name} className="w-24 h-24 rounded-xl object-cover border"/>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">{job.title}</h1>
                <div className="flex items-center gap-2 text-lg text-gray-600 mt-1">
                  <Link to="#" className="hover:text-brand-green">{job.company.name}</Link>
                  {job.company.isVerified && <ShieldCheck size={20} className="text-blue-500" title="Verified Company"/>}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-gray-500 mb-8 border-t border-b py-4">
              <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
              <div className="flex items-center gap-2"><Briefcase size={16} /> {job.workType}</div>
              <div className="flex items-center gap-2"><DollarSign size={16} /> ${job.salaryRange[0]/1000}k - ${job.salaryRange[1]/1000}k</div>
              <div className="flex items-center gap-2"><Clock size={16} /> Posted on {new Date(job.postedDate).toLocaleDateString()}</div>
            </div>

            <div className="prose max-w-none text-gray-700">
              <h2 className="font-bold text-xl mb-3 text-gray-800">Job Description</h2>
              <p>{job.description}</p>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <>
                  <h2 className="font-bold text-xl mt-6 mb-3 text-gray-800">Responsibilities</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </>
              )}
              
              {job.qualifications && job.qualifications.length > 0 && (
                <>
                  <h2 className="font-bold text-xl mt-6 mb-3 text-gray-800">Qualifications</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.qualifications.map((item, index) => <li key={index}>{item}</li>)}
                  </ul>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <button
                onClick={handleApplyClick}
                className="w-full bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-green-light transition duration-300 flex items-center justify-center gap-2 shadow-lg"
              >
                {job.isThirdParty ? 'Apply on Company Site' : 'Apply Now'}
                {job.isThirdParty && <ExternalLink size={18} />}
              </button>
              {!user && <p className="text-xs text-gray-500 mt-3">You will be asked to <Link to="/login" className="text-brand-green hover:underline">log in</Link> or <Link to="/register" className="text-brand-green hover:underline">create an account</Link>.</p>}
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">About {job.company.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{job.company.description}</p>
              <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-brand-green font-semibold text-sm flex items-center gap-1 hover:underline">
                Visit Website <ExternalLink size={14}/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
