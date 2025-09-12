
import React from 'react';
import type { Document } from '../types';
import { DocumentStatus } from '../constants';
import DocumentItem from './DocumentItem';

interface DocumentListProps {
  documents: Document[];
  onUpdateStatus: (id: string, status: DocumentStatus) => void;
  onDelete: (id: string) => void;
  onUpdatePublicStatus: (id: string, isPublic: boolean) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onUpdateStatus, onDelete, onUpdatePublicStatus }) => {
  if (documents.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
         <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No documents found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter, or add a new document.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map(doc => (
        <DocumentItem 
          key={doc.id} 
          document={doc} 
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
          onUpdatePublicStatus={onUpdatePublicStatus}
        />
      ))}
    </div>
  );
};

export default DocumentList;
