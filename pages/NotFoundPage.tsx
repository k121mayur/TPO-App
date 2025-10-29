
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <Leaf size={80} className="text-brand-green-light mb-4 animate-bounce" />
      <h1 className="text-6xl font-extrabold text-brand-green-dark">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</p>
      <p className="text-gray-500 mt-4 max-w-md">
        Oops! It seems the page you are looking for has been moved, deleted, or never existed. Let's get you back on a green path.
      </p>
      <Link
        to="/"
        className="mt-8 bg-brand-green text-white font-bold py-3 px-6 rounded-full hover:bg-brand-green-light transition duration-300 shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
