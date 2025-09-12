
import React from 'react';
import { DocumentStatus } from '../constants';

interface SearchBarProps {
  onSearch: (term: string) => void;
  onFilter: (status: DocumentStatus | 'all') => void;
  currentFilter: DocumentStatus | 'all';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter, currentFilter }) => {
  const statusOptions = ['all', ...Object.values(DocumentStatus)];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row items-center gap-4">
      <div className="relative flex-grow w-full">
        <input
          type="text"
          placeholder="Search by title, description, or category..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
           <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>
      <div className="flex-shrink-0 w-full md:w-auto">
        <select
          value={currentFilter}
          onChange={(e) => onFilter(e.target.value as DocumentStatus | 'all')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition appearance-none"
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
