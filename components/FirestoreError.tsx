import React from 'react';

interface FirestoreErrorProps {
  error: Error;
}

const FirestoreError: React.FC<FirestoreErrorProps> = ({ error }) => {
  const message = error.message || 'An unknown error occurred.';

  // Check for missing index error and extract the creation link
  const indexLinkMatch = message.match(/The query requires an index. You can create it here: (https:\/\/[^\s]+)/);
  const indexCreationLink = indexLinkMatch ? indexLinkMatch[1] : null;

  const correctRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Rules for the 'documents' collection
    match /documents/{docId} {
      allow read: if resource.data.isPublic == true || (request.auth != null && request.auth.uid == resource.data.userId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Rules for the '_config' collection for the admin user
    match /_config/admin_user {
      allow read: if true;
      allow create: if request.auth != null && !exists(/databases/$(database)/documents/_config/admin_user);
      allow update, delete: if false;
    }
  }
}
  `.trim();

  const renderContent = () => {
    if (indexCreationLink) {
      return (
        <>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Database Index Required</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your Firestore database is missing a required index to perform the document query. This is a one-time setup step.
          </p>
          <div className="mt-4">
            <a
              href={indexCreationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Index in Firebase Console
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-500">After clicking, it may take a few minutes for the index to be built. Please refresh this page afterward.</p>
        </>
      );
    }

    // Default to showing the permission error solution, as it's the most likely root cause
    // if the specific "missing index" link isn't found.
    return (
        <>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Action Required: Fix Database Permissions</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 text-left space-y-2 mt-2">
                <p>
                    The application is being blocked by your database's security rules. This is the most common cause of connection errors.
                </p>
                <p>
                    <span className="font-semibold">This is likely why you are not seeing a "Create Index" link.</span> The permission error must be fixed first before the database can check for missing indexes.
                </p>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-left">Please go to your Firestore 'Rules' tab and replace the existing rules with the following:</p>
            <pre className="mt-2 text-xs p-3 bg-gray-100 dark:bg-gray-900 rounded-md overflow-x-auto whitespace-pre-wrap text-left">
            <code>
              {correctRules}
            </code>
          </pre>
        </>
    );
  };


  return (
    <div className="text-center py-10 px-6 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-md border border-red-200 dark:border-red-800">
       <div className="flex justify-center items-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
       </div>
       {renderContent()}
    </div>
  );
};

export default FirestoreError;
