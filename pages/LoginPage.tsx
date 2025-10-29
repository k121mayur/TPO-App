
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd validate credentials against a backend
    await login(role);
    if(role === UserRole.EMPLOYEE) navigate('/profile');
    else if(role === UserRole.EMPLOYER) navigate('/dashboard');
    else navigate('/admin');
  };
  
  const handleGoogleLogin = async () => {
    await login(UserRole.EMPLOYEE); // Mocking google login as an employee
    navigate('/profile');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm" placeholder="Email address" />
            </div>
            <div>
              <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm" placeholder="Password" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
                <span className="font-medium text-gray-700 mr-2">Login as:</span>
                <select value={role} onChange={e => setRole(e.target.value as UserRole)} className="border-gray-300 rounded-md">
                    <option value={UserRole.EMPLOYEE}>Job Seeker</option>
                    <option value={UserRole.EMPLOYER}>Employer</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                </select>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-brand-green hover:text-brand-green-light">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark">
              Sign in
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
             <button onClick={handleGoogleLogin} className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green">
                <img className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo"/>
                <span>Sign in with Google</span>
            </button>
        </div>
         <p className="mt-2 text-center text-sm text-gray-600">
            Not a member?{' '}
            <Link to="/register" className="font-medium text-brand-green hover:text-brand-green-light">
               Start your journey here
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
