import React, { useState, useMemo } from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import DocumentList from './DocumentList';
import AddDocumentModal from './AddDocumentModal';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentStatus } from '../constants';
import type { Document } from '../types';
import { useAuth } from '../contexts/AuthContext';
import FirestoreError from './FirestoreError';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { documents, isLoading, error, addDocument, updateDocumentStatus, deleteDocument, updateDocumentPublicStatus } = useDocuments(user?.uid || null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');

  const filteredDocuments = useMemo(() => {
    return documents
      .filter(doc => {
        const matchesSearchTerm = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  (doc.trackingId && doc.trackingId.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearchTerm && matchesStatus;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [documents, searchTerm, statusFilter]);

  const handleAddDocument = async (newDocument: Omit<Document, 'id' | 'createdAt' | 'userId' | 'isPublic' | 'trackingId'>) => {
    await addDocument(newDocument);
    setIsModalOpen(false);
  };

  const renderContent = () => {
    if (isLoading) {
        return (
          <div className="flex justify-center items-center py-16">
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 dark:border-gray-700 dark:border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading Documents...</p>
          </div>
        );
    }
    
    if (error) {
        return <FirestoreError error={error} />;
    }

    return (
        <DocumentList 
          documents={filteredDocuments} 
          onUpdateStatus={updateDocumentStatus}
          onDelete={deleteDocument}
          onUpdatePublicStatus={updateDocumentPublicStatus}
        />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header 
        userEmail={user?.email || null}
        onLogout={logout}
        onAddDocument={() => setIsModalOpen(true)}
      />
      
      <main className="container mx-auto p-4 md:p-6">
        <SearchBar 
          onSearch={setSearchTerm}
          onFilter={setStatusFilter}
          currentFilter={statusFilter}
        />
        
        {renderContent()}

      </main>

      {isModalOpen && (
        <AddDocumentModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddDocument} 
        />
      )}
    </div>
  );
};

export default Dashboard;