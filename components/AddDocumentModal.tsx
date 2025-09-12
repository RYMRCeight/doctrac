import React, { useState, useCallback, useEffect } from 'react';
import type { Document } from '../types';
import { DocumentStatus } from '../constants';
import { generateSummary, suggestCategory } from '../services/geminiService';
import Spinner from './Spinner';

interface AddDocumentModalProps {
  onClose: () => void;
  onAdd: (newDocument: Omit<Document, 'id' | 'createdAt' | 'userId' | 'isPublic' | 'trackingId'>) => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<DocumentStatus>(DocumentStatus.Draft);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        setFileContent(content);
        
        if(content.length > 1000000) { // Limit to avoid very large API requests
            setError("File is too large to summarize.");
            return;
        }

        setIsSummarizing(true);
        setError('');
        const summary = await generateSummary(content);
        setDescription(summary);
        setIsSummarizing(false);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
        setIsSummarizing(false);
      }
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
        setError('Title is required.');
        return;
    }
    onAdd({ title, description, status, category: category || 'Uncategorized', fileName, fileContent });
  };

  const handleSuggestCategory = useCallback(async () => {
      if (!title.trim()) return;
      setIsCategorizing(true);
      const suggested = await suggestCategory(title, description);
      setCategory(suggested);
      setIsCategorizing(false);
  }, [title, description]);

  useEffect(() => {
    const handler = setTimeout(() => {
        if(title && !category) {
            handleSuggestCategory();
        }
    }, 1000); // Debounce AI call

    return () => {
      clearTimeout(handler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold">Add New Document</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
          </div>

          <div className="relative">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (AI summary will appear here)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
            {isSummarizing && <Spinner />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
              {isCategorizing && <Spinner />}
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value as DocumentStatus)} className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                {Object.values(DocumentStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attach File (optional, .txt, .md, .json)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,.json,.csv" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    {fileName ? <p className="text-xs text-gray-500 dark:text-gray-400">{fileName}</p> : <p className="text-xs text-gray-500 dark:text-gray-400">Text files up to 1MB</p>}
                </div>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end space-x-3 rounded-b-xl">
          <button type="button" onClick={onClose} className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus-within:ring-offset-gray-800 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus-within:ring-offset-gray-800 focus:ring-indigo-500">
            Add Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocumentModal;