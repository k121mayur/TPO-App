
import React, { useState, useEffect } from 'react';
import { getAdminStats } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Briefcase, Building, Users, ExternalLink } from 'lucide-react';
import Card from '../components/common/Card';

interface AdminStats {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  redirects: { jobId: string, jobTitle: string, clicks: number }[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getAdminStats();
      setStats(data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-brand-green"></div></div>;
  }
  
  const chartData = stats.redirects.map(r => ({ name: r.jobTitle.substring(0, 20) + '...', Clicks: r.clicks }));

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 flex items-center gap-6 !shadow-md">
            <div className="p-4 bg-brand-sky rounded-full"><Briefcase size={32} className="text-brand-green"/></div>
            <div>
              <p className="text-gray-500 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalJobs}</p>
            </div>
          </Card>
           <Card className="p-6 flex items-center gap-6 !shadow-md">
            <div className="p-4 bg-brand-sky rounded-full"><Building size={32} className="text-brand-green"/></div>
            <div>
              <p className="text-gray-500 text-sm">Total Companies</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalCompanies}</p>
            </div>
          </Card>
           <Card className="p-6 flex items-center gap-6 !shadow-md">
            <div className="p-4 bg-brand-sky rounded-full"><Users size={32} className="text-brand-green"/></div>
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
            </div>
          </Card>
        </div>

        {/* Third Party Job Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Third-Party Job Redirects</h2>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Clicks" fill="#556B2F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Third-Party Jobs</h2>
                <button className="w-full bg-brand-green text-white py-2 px-4 rounded-md hover:bg-brand-green-light transition duration-300 shadow-sm flex items-center justify-center gap-2">
                    <ExternalLink size={18} /> Add New Redirect Job
                </button>
                 <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {stats.redirects.map(r => (
                        <div key={r.jobId} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                            <span className="text-sm text-gray-600 truncate">{r.jobTitle}</span>
                            <span className="font-bold text-brand-green-dark">{r.clicks}</span>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
