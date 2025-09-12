import { useState, useCallback, useEffect } from 'react';
import type { Document } from '../types';
import * as dbService from '../services/dbService';

export const useDocuments = (userId: string | null) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userId) {
            setDocuments([]);
            setIsLoading(false);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        // Subscribe to real-time updates from Firestore for the specific user
        const unsubscribe = dbService.subscribeToDocuments(userId, (docs) => {
            setDocuments(docs);
            setIsLoading(false);
        }, (error) => {
            console.error("Failed to subscribe to documents:", error);
            setError(error); // Set the error state
            setIsLoading(false);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [userId]);

    const addDocument = useCallback(async (newDocumentData: Omit<Document, 'id' | 'createdAt' | 'userId' | 'isPublic' | 'trackingId'>) => {
        if (!userId) return;
        try {
            await dbService.addDocument(userId, newDocumentData);
        } catch (error) {
            console.error("Failed to add document:", error);
            alert("An error occurred while adding the document.");
        }
    }, [userId]);

    const updateDocumentStatus = useCallback(async (id: string, status: Document['status']) => {
        if (!userId) return;
        try {
            await dbService.updateDocumentStatus(id, status);
        } catch (error)
        {
            console.error("Failed to update document status:", error);
            alert("An error occurred while updating the document.");
        }
    }, [userId]);

    const updateDocumentPublicStatus = useCallback(async (id: string, isPublic: boolean) => {
        if (!userId) return;
        try {
            await dbService.updateDocumentPublicStatus(id, isPublic);
        } catch (error)
        {
            console.error("Failed to update public status:", error);
            alert("An error occurred while updating the public status.");
        }
    }, [userId]);
    
    const deleteDocument = useCallback(async (id: string) => {
        if (!userId) return;
        try {
            await dbService.deleteDocument(id);
        } catch (error) {
            console.error("Failed to delete document:", error);
            alert("An error occurred while deleting the document.");
        }
    }, [userId]);

    return { documents, isLoading: isLoading && !!userId, error, addDocument, updateDocumentStatus, deleteDocument, updateDocumentPublicStatus };
};