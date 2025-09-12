
import React from 'react';

interface HeaderProps {
  userEmail: string | null;
  onLogout: () => void;
  onAddDocument: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, onAddDocument }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Gemini Document Tracker
            </h1>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center space-x-4">
             <span className="text-sm text-gray-500 dark:text-gray-400" title={userEmail || ''}>{userEmail}</span>
             <button
                onClick={onLogout}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
              >
                Logout
              </button>
          </div>
           <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
            <button
              onClick={onAddDocument}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Document
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;