
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.EMPLOYEE);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const createdUser = await register({ name, email, password, role });
      if (createdUser.role === UserRole.EMPLOYEE) navigate('/profile');
      else navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to create account');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        </div>
        <div className="flex justify-center rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setRole(UserRole.EMPLOYEE)}
            className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg ${
              role === UserRole.EMPLOYEE
                ? 'bg-white shadow text-brand-green'
                : 'text-gray-700 hover:bg-white/[0.5]'
            } focus:outline-none transition-all duration-300`}
          >
            I'm a Job Seeker
          </button>
          <button
            onClick={() => setRole(UserRole.EMPLOYER)}
            className={`w-full py-2.5 text-sm font-medium leading-5 rounded-lg ${
              role === UserRole.EMPLOYER
                ? 'bg-white shadow text-brand-green'
                : 'text-gray-700 hover:bg-white/[0.5]'
            } focus:outline-none transition-all duration-300`}
          >
            I'm an Employer
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark"
            >
              Create Account
            </button>
          </div>
        </form>
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
