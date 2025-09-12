
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      <div className="w-5 h-5 border-2 border-t-indigo-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
