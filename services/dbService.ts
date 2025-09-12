import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
    getDocs,
    getDoc,
    Timestamp,
    where,
    type QueryDocumentSnapshot,
    DocumentSnapshot,
    setDoc,
    limit
} from 'firebase/firestore';
import type { Document } from '../types';
import { DocumentStatus } from '../constants';
import { db } from './firebase';

const DOCS_COLLECTION = 'documents';
const CONFIG_COLLECTION = '_config';
const docsCollectionRef = collection(db, DOCS_COLLECTION);

// Helper to generate a unique, human-readable tracking ID
const generateTrackingId = (): string => {
    // Using a smaller, unambiguous character set
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = 'DOC-';
    for (let i = 0; i < 7; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // In a larger-scale application, you might check for collisions here,
    // but the probability is extremely low for this character set and length.
    return result;
};


// Helper to convert Firestore doc to our app's Document type
const fromFirestore = (firestoreDoc: QueryDocumentSnapshot | DocumentSnapshot): Document => {
    const data = firestoreDoc.data() || {};

    const plainDoc: any = { id: firestoreDoc.id };

    plainDoc.title = typeof data.title === 'string' ? data.title : '';
    plainDoc.description = typeof data.description === 'string' ? data.description : '';
    plainDoc.status = Object.values(DocumentStatus).includes(data.status) ? data.status : DocumentStatus.Draft;
    plainDoc.category = typeof data.category === 'string' ? data.category : 'Uncategorized';
    plainDoc.userId = typeof data.userId === 'string' ? data.userId : '';
    plainDoc.fileName = typeof data.fileName === 'string' ? data.fileName : undefined;
    plainDoc.fileContent = typeof data.fileContent === 'string' ? data.fileContent : undefined;
    plainDoc.isPublic = typeof data.isPublic === 'boolean' ? data.isPublic : false;
    plainDoc.trackingId = typeof data.trackingId === 'string' ? data.trackingId : undefined;
    
    const ts = data.createdAt as Timestamp;
    const date = ts && typeof ts.toDate === 'function' ? ts.toDate() : new Date();
    plainDoc.createdAt = new Date(date.getTime());
    
    return plainDoc as Document;
};


export const subscribeToDocuments = (
    userId: string,
    onUpdate: (documents: Document[]) => void, 
    onError: (error: Error) => void
) => {
    const q = query(
        docsCollectionRef, 
        where("userId", "==", userId),
        orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(fromFirestore);
        onUpdate(documents);
    }, (error) => {
        console.error("Error fetching documents from Firestore: ", error);
        onError(error);
    });

    return unsubscribe;
};

export const addDocument = async (userId: string, newDocumentData: Omit<Document, 'id' | 'createdAt' | 'userId' | 'isPublic' | 'trackingId'>) => {
    const trackingId = generateTrackingId();
    await addDoc(docsCollectionRef, {
        ...newDocumentData,
        userId: userId,
        isPublic: false, // Documents are private by default
        trackingId: trackingId, // Assign the new tracking ID
        createdAt: serverTimestamp()
    });
};

export const updateDocumentStatus = async (id: string, status: Document['status']) => {
    const docRef = doc(db, DOCS_COLLECTION, id);
    await updateDoc(docRef, { status });
};

export const updateDocumentPublicStatus = async (id: string, isPublic: boolean) => {
    const docRef = doc(db, DOCS_COLLECTION, id);
    await updateDoc(docRef, { isPublic });
};

export const deleteDocument = async (id: string) => {
    const docRef = doc(db, DOCS_COLLECTION, id);
    await deleteDoc(docRef);
};

export const getPublicDocument = async (id: string): Promise<Document | null> => {
    const docRef = doc(db, DOCS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().isPublic !== true) {
        return null;
    }
    
    return fromFirestore(docSnap);
};


export const getDocumentIdByTrackingId = async (trackingId: string): Promise<string | null> => {
    const q = query(
        docsCollectionRef,
        where("trackingId", "==", trackingId),
        where("isPublic", "==", true),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return null;
    }

    // Return the Firestore document ID of the first match.
    return querySnapshot.docs[0].id;
};

export const checkIfAdminExists = async (): Promise<boolean> => {
    const adminUserDocRef = doc(db, CONFIG_COLLECTION, 'admin_user');
    const docSnap = await getDoc(adminUserDocRef);
    return docSnap.exists();
};

export const registerAdmin = async (userId: string) => {
    const adminUserDocRef = doc(db, CONFIG_COLLECTION, 'admin_user');
    // This action is protected by Firestore security rules to ensure it only happens once.
    await setDoc(adminUserDocRef, { userId, createdAt: serverTimestamp() });
};