
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import PublicDocumentView from './components/PublicDocumentView';
import PublicTrackingInput from './components/PublicTrackingInput';

const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const publicDocIdMatch = hash.match(/^#\/public\/([a-zA-Z0-9]+)$/);
  const publicDocId = publicDocIdMatch ? publicDocIdMatch[1] : null;

  if (publicDocId) {
    return <PublicDocumentView docId={publicDocId} />;
  }
  
  if (hash === '#/track') {
    return <PublicTrackingInput />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-t-indigo-500 border-gray-200 dark:border-gray-700 dark:border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <Dashboard />;
};

export default App;