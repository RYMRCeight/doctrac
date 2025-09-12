import React, { useState } from 'react';
import * as dbService from '../services/dbService';

const PublicTrackingInput: React.FC = () => {
    const [trackingId, setTrackingId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedId = trackingId.trim().toUpperCase();
        if (!trimmedId) return;

        setIsLoading(true);
        setError('');
        try {
            const docId = await dbService.getDocumentIdByTrackingId(trimmedId);
            if (docId) {
                window.location.hash = `#/public/${docId}`;
            } else {
                setError('No public document found with that Tracking ID.');
            }
        } catch (err) {
            console.error("Error looking up document:", err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#/';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex flex-col justify-center items-center">
            <div className="max-w-md w-full">
                <header className="mb-8 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                        </svg>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                            Gemini Document Tracker
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">Public Document Tracking</p>
                </header>

                <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Track Document Status</h2>
                        <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                            Enter the Tracking ID you wish to track.
                        </p>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                         {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        <div>
                            <label htmlFor="trackingId" className="sr-only">Tracking ID</label>
                            <input
                                id="trackingId"
                                name="trackingId"
                                type="text"
                                required
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Enter Tracking ID (e.g., DOC-123XYZ)"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:bg-indigo-400 dark:disabled:bg-indigo-800"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-t-white border-transparent rounded-full animate-spin"></div>
                                ) : (
                                    'Track Document'
                                )}
                            </button>
                        </div>
                    </form>
                </main>
                <footer className="text-center mt-8">
                    <a href="#/" onClick={handleNavigateHome} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Back to Sign In
                    </a>
                </footer>
            </div>
        </div>
    );
};

export default PublicTrackingInput;