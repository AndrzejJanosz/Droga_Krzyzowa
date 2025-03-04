import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GoHomeFill } from "react-icons/go";

const HomeButton = () => {
  const location = useLocation();
  const isActive = location.pathname === '/';

  return (
    <div className="fixed z-50 top-4 right-4">
      <Link 
        to="/" 
        className={`flex items-center justify-center p-2 rounded-full transition-all duration-300
          ${isActive
            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
            : 'bg-gray-900/90 text-gray-400 border border-gray-800'}`}
      >
        <GoHomeFill className="text-xl" />
      </Link>
    </div>
  );
};

export default HomeButton;