import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoAnalyticsOutline,IoInformationCircleOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { FaBookBible } from "react-icons/fa6";


const Navbar = () => {
  const location = useLocation();
  
  // Funkcja sprawdzająca aktywną ścieżkę
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed left-0 right-0 z-40 flex justify-center bottom-4">
      <div className="relative w-11/12 max-w-lg px-4 py-3 border border-gray-800 shadow-xl rounded-2xl bg-gray-900/95 backdrop-blur-md">
        {/* Przyciski nawigacji */}
        <div className="relative z-10 grid grid-cols-3">
          <Link
            to="/drogi"
            className="flex flex-col items-center justify-center py-1"
          >
            <div className={`p-2 rounded-full transition-all duration-300 
              ${isActive('/drogi') 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                : 'text-gray-400'}`}>
              <IoAnalyticsOutline className="text-xl" />
            </div>
            <span className={`text-xs mt-1 font-medium transition-all duration-300 
              ${isActive('/drogi') ? 'text-white' : 'text-gray-500'}`}>
              Drogi
            </span>
          </Link>
          
          {/* <Link
            to="/nawigacja"
            className="flex flex-col items-center justify-center py-1"
          >
            <div className={`p-2 rounded-full transition-all duration-300 
              ${isActive('/nawigacja') 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                : 'text-gray-400'}`}>
              <LuMapPin className="text-xl" />
            </div>
            <span className={`text-xs mt-1 font-medium transition-all duration-300 
              ${isActive('/nawigacja') ? 'text-white' : 'text-gray-500'}`}>
              Nawigacja
            </span>
          </Link> */}
          
          <Link
            to="/rozwazania"
            className="flex flex-col items-center justify-center py-1"
          >
            <div className={`p-2 rounded-full transition-all duration-300 
              ${isActive('/rozwazania') 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' 
                : 'text-gray-400'}`}>
              <FaBookBible className="text-xl" />
            </div>
            <span className={`text-xs mt-1 font-medium transition-all duration-300 
              ${isActive('/rozwazania') ? 'text-white' : 'text-gray-500'}`}>
              Rozważania
            </span>
          </Link>
          
          <Link
            to="https://swmaciej.org.pl/parafialna-terenowa-droga-krzyzowa/"
            className="flex flex-col items-center justify-center py-1"
          >
            <div className="p-2 text-gray-400 transition-all duration-300 rounded-full">
              <IoInformationCircleOutline className="text-2xl" />
            </div>
            <span className="mt-1 text-xs font-medium text-gray-500 transition-all duration-300">
              Info
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;