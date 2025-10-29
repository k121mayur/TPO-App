
import React from 'react';
import { Leaf, Twitter, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-green-dark text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Leaf className="h-8 w-8" />
              <span>GreenJobs</span>
            </Link>
            <p className="text-gray-300">Connecting talent with sustainable opportunities.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white"><Twitter /></a>
              <a href="#" className="text-gray-300 hover:text-white"><Linkedin /></a>
              <a href="#" className="text-gray-300 hover:text-white"><Facebook /></a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Job Seekers</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/jobs" className="text-gray-300 hover:text-white">Find Jobs</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-white">Create Profile</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Career Advice</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Employers</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white">Post a Job</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Company Profiles</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider uppercase">Stay Updated</h3>
            <p className="mt-4 text-gray-300">Subscribe to our newsletter for the latest green job alerts.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Your Email" className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none" />
              <button className="bg-brand-green-light px-4 py-2 rounded-r-md hover:bg-brand-green">Go</button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GreenJobs Portal. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
