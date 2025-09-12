import { DocumentStatus } from './constants';

export interface Document {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  category: string;
  createdAt: Date;
  userId: string;
  isPublic: boolean;
  trackingId?: string; // Human-readable ID for public tracking
  fileName?: string;
  fileContent?: string; // Storing content for summary generation
}