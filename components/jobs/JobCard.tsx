
import React from 'react';
import { Job } from '../../types';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import { MapPin, Briefcase, DollarSign, Clock, ExternalLink, ShieldCheck } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <Card className="flex flex-col p-6" onClick={handleCardClick}>
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img src={job.company.logo} alt={`${job.company.name} logo`} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h3 className="text-xl font-bold text-gray-800 hover:text-brand-green-dark transition-colors">{job.title}</h3>
              <div className="flex items-center gap-2">
                <p className="text-md text-gray-600">{job.company.name}</p>
                {job.company.isVerified && <ShieldCheck size={16} className="text-blue-500" title="Verified Company"/>}
              </div>
            </div>
          </div>
          {job.isThirdParty && <ExternalLink size={20} className="text-gray-400" />}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-2"><MapPin size={16} /> {job.location}</div>
          <div className="flex items-center gap-2"><Briefcase size={16} /> {job.workType}</div>
          <div className="flex items-center gap-2 col-span-2"><DollarSign size={16} /> ${job.salaryRange[0] / 1000}k - ${job.salaryRange[1] / 1000}k</div>
        </div>
        <p className="text-gray-700 text-sm line-clamp-2">{job.description}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock size={14} /> 
          Posted on {new Date(job.postedDate).toLocaleDateString()}
        </div>
        <span className="bg-brand-sky-light text-brand-green-dark font-semibold px-3 py-1 rounded-full">{job.sector}</span>
      </div>
    </Card>
  );
};

export default JobCard;
