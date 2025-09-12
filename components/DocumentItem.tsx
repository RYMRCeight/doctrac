import React, { useState } from 'react';
import type { Document } from '../types';
import { DocumentStatus } from '../constants';
import StatusBadge from './StatusBadge';

interface DocumentItemProps {
  document: Document;
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onDelete: (id: string) => void;
  onUpdatePublicStatus: (id: string, isPublic: boolean) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onUpdateStatus, onDelete, onUpdatePublicStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(document.createdAt);

  const handleCopyLink = () => {
    const publicUrl = `${window.location.origin}${window.location.pathname}#/public/${document.id}`;
    navigator.clipboard.writeText(publicUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
             <span className="text-indigo-500 font-semibold bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300 px-3 py-1 rounded-full text-sm">{document.category}</span>
             <StatusBadge status={document.status} />
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <p className="text-xl font-bold text-gray-900 dark:text-white truncate" title={document.title}>{document.title}</p>
             {document.trackingId && (
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50 px-2 py-0.5 rounded-md">
                    {document.trackingId}
                </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Created on {formattedDate}
            {document.fileName && ` • ${document.fileName}`}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0 flex-shrink-0">
          <select
            value={document.status}
            onChange={(e) => onUpdateStatus(document.id, e.target.value as DocumentStatus)}
            onClick={(e) => e.stopPropagation()}
            className="text-sm bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {Object.values(DocumentStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
           <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
           <button
             onClick={() => onDelete(document.id)}
             className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
             aria-label="Delete document"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
             </svg>
           </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap mt-1">{document.description || "No description provided."}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                <label htmlFor={`public-toggle-${document.id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Access</label>
                <button
                    type="button"
                    role="switch"
                    aria-checked={document.isPublic}
                    onClick={() => onUpdatePublicStatus(document.id, !document.isPublic)}
                    className={`${document.isPublic ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:ring-offset-gray-800`}
                    id={`public-toggle-${document.id}`}
                >
                    <span className="sr-only">Toggle public access</span>
                    <span aria-hidden="true" className={`${document.isPublic ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}></span>
                </button>
            </div>
            {document.isPublic && (
                <button
                    onClick={handleCopyLink}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>
                            Copy Link
                        </>
                    )}
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentItem;