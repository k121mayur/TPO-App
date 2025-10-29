
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';
import { Leaf, Briefcase, User as UserIcon, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case UserRole.EMPLOYEE:
        return '/profile';
      case UserRole.EMPLOYER:
        return '/dashboard';
      case UserRole.ADMIN:
        return '/admin';
      default:
        return '/';
    }
  };

  const navLinks = (
    <>
      <Link to="/jobs" className="text-gray-600 hover:text-brand-green-dark transition duration-300 flex items-center gap-2">
        <Briefcase size={18} /> Find Jobs
      </Link>
      {user && (
        <Link to={getDashboardPath()} className="text-gray-600 hover:text-brand-green-dark transition duration-300 flex items-center gap-2">
          {user.role === UserRole.EMPLOYEE ? <UserIcon size={18} /> : <LayoutDashboard size={18} />}
           {user.role === UserRole.EMPLOYEE ? 'My Profile' : 'Dashboard'}
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-green-dark">
            <Leaf className="h-8 w-8" />
            <span>GreenJobs</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center gap-2 focus:outline-none">
                    <img src={user.profilePicture} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                    <span className="font-medium text-gray-700">{user.name}</span>
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in-up">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-gray-600 hover:text-brand-green font-medium">Log In</Link>
                  <Link to="/register" className="bg-brand-green text-white px-4 py-2 rounded-full hover:bg-brand-green-light transition duration-300 shadow-sm">Sign Up</Link>
                </div>
              )}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-gray-600 hover:text-brand-green-dark focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white pb-4 animate-fade-in-up">
          <nav className="flex flex-col items-center space-y-4">
            {navLinks}
            {user ? (
               <button onClick={handleLogout} className="w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center justify-center gap-2">
                 <LogOut size={16} /> Logout
               </button>
            ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-brand-green font-medium">Log In</Link>
                  <Link to="/register" className="bg-brand-green text-white px-4 py-2 rounded-full hover:bg-brand-green-light transition duration-300 shadow-sm">Sign Up</Link>
                </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
