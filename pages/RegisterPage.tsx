
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(role);
    if(role === UserRole.EMPLOYEE) navigate('/profile');
    else navigate('/dashboard');
  };
  
   const handleGoogleRegister = async () => {
    await login(role); // Mocking google register
    if(role === UserRole.EMPLOYEE) navigate('/profile');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an account
          </h2>
        </div>
        <div className="flex justify-center rounded-lg bg-gray-100 p-1">
            <button 
                onClick={() => setRole(UserRole.EMPLOYEE)}
                className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg
                 ${role === UserRole.EMPLOYEE ? 'bg-white shadow text-brand-green' : 'text-gray-700 hover:bg-white/[0.5]'}
                 focus:outline-none transition-all duration-300`}
            >
                I'm a Job Seeker
            </button>
             <button 
                onClick={() => setRole(UserRole.EMPLOYER)}
                className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg
                 ${role === UserRole.EMPLOYER ? 'bg-white shadow text-brand-green' : 'text-gray-700 hover:bg-white/[0.5]'}
                 focus:outline-none transition-all duration-300`}
            >
                I'm an Employer
            </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="Full Name" />
            </div>
             <div>
              <input name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <input name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark">
              Create Account
            </button>
          </div>
        </form>
         <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
        </div>
        <div>
             <button onClick={handleGoogleRegister} className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green">
                <img className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                <span>Sign up with Google</span>
            </button>
        </div>
         <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-green hover:text-brand-green-light">
               Sign in
            </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
