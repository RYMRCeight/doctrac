import React, { useState, useEffect } from 'react';
import type { Document } from '../types';
import * as dbService from '../services/dbService';
import StatusBadge from './StatusBadge';

interface PublicDocumentViewProps {
  docId: string;
}

const PublicDocumentView: React.FC<PublicDocumentViewProps> = ({ docId }) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError('');
      try {
        const doc = await dbService.getPublicDocument(docId);
        if (doc) {
          setDocument(doc);
        } else {
          setError('Document not found or is not public.');
        }
      } catch (err) {
        console.error('Error fetching public document:', err);
        setError('An error occurred while trying to fetch the document.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [docId]);

  const handleNavigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = '#/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 dark:border-gray-700 dark:border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading Document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center text-center px-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{error}</p>
        <a href="#/" onClick={handleNavigateHome} className="mt-6 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
          Go to Homepage
        </a>
      </div>
    );
  }
  
  if (!document) {
      return null; // Should be covered by error state
  }
  
  const formattedDate = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(document.createdAt);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 text-center">
                 <div className="flex items-center justify-center space-x-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        Gemini Document Tracker
                    </h1>
                </div>
                 <p className="text-gray-500 dark:text-gray-400">Public Tracking View</p>
            </header>

            <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white truncate" title={document.title}>
                            {document.title}
                        </h2>
                        {document.trackingId && <p className="mt-1 text-md font-mono text-gray-500 dark:text-gray-400">Tracking ID: {document.trackingId}</p>}
                    </div>
                    <div className="mt-3 sm:mt-0 flex-shrink-0">
                        <StatusBadge status={document.status} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                        <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{document.category}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created On</h3>
                        <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{formattedDate}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{document.description || "No description provided."}</p>
                </div>
            </main>
             <footer className="text-center mt-8">
                <a href="#/" onClick={handleNavigateHome} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Sign in to manage your documents
                </a>
            </footer>
        </div>
    </div>
  );
};

export default PublicDocumentView;