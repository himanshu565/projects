import React from "react";

// import { create } from 'domain';

interface HeaderProps {
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <div className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-green-400 hover:bg-gray-200 transition-colors duration-200">
            
            create user
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900"> lone wolf</p>
            </div>

            <img
              src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face"
              alt="Jane Cooper"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
