
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { mockUsers } from '../services/mockData';
import { Edit, Save, Upload, FileText } from 'lucide-react';

const EmployeeProfilePage: React.FC = () => {
  const { user } = useAuth();
  // We'll use mock data directly for this example
  const [profile, setProfile] = useState(mockUsers.employee.profile);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <div>Loading user data...</div>;
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfile(prev => ({...prev, resumeUrl: file.name}));
      // In a real app, you'd upload this file to a server.
      alert(`Uploaded ${file.name}`);
    }
  };


  return (
    <div className="bg-brand-sky-light min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 pb-8 border-b">
            <img src={user.profilePicture} alt={user.name} className="w-40 h-40 rounded-full object-cover border-4 border-brand-green" />
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-lg text-gray-600 mt-1">{user.email}</p>
              <div className="mt-4">
                {isEditing ? (
                  <textarea 
                    className="w-full p-2 border rounded-md" 
                    value={profile.summary}
                    onChange={(e) => setProfile({...profile, summary: e.target.value})}
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-700">{profile.summary}</p>
                )}
              </div>
            </div>
            <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 bg-brand-green-light text-white px-4 py-2 rounded-lg hover:bg-brand-green transition-colors">
              {isEditing ? <Save size={18} /> : <Edit size={18} />}
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column for Skills and Resume */}
            <div className="md:col-span-1 space-y-8">
               <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="bg-brand-sky text-brand-green-dark px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                  </div>
              </div>
               <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700">Resume</h3>
                  {profile.resumeUrl ? (
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2 text-gray-600">
                             <FileText size={20} className="text-brand-green"/>
                             <span>{profile.resumeUrl.split('/').pop()}</span>
                         </div>
                         <label className="cursor-pointer text-brand-green hover:underline">
                            Change
                            <input type="file" className="hidden" onChange={handleFileChange} />
                         </label>
                      </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                            <Upload size={20} className="text-gray-600"/>
                            <span className="font-medium text-gray-600">Upload your resume</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
              </div>
            </div>

            {/* Right Column for Experience and Education */}
            <div className="md:col-span-2 space-y-8">
               <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Experience</h3>
                  <div className="space-y-6">
                    {profile.experience.map(exp => (
                      <div key={exp.id} className="pl-4 border-l-2 border-brand-green">
                          <h4 className="text-lg font-semibold text-gray-700">{exp.title}</h4>
                          <p className="text-md text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</p>
                          <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
               </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Education</h3>
                  <div className="space-y-6">
                   {profile.education.map(edu => (
                      <div key={edu.id} className="pl-4 border-l-2 border-brand-green">
                          <h4 className="text-lg font-semibold text-gray-700">{edu.institution}</h4>
                          <p className="text-md text-gray-600">{edu.degree}, {edu.fieldOfStudy}</p>
                          <p className="text-sm text-gray-500">Graduated {edu.gradYear}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
