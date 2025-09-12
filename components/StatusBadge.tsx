
import React from 'react';
import { DocumentStatus } from '../constants';

interface StatusBadgeProps {
  status: DocumentStatus;
}

const statusColorMap: Record<DocumentStatus, string> = {
  [DocumentStatus.Draft]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [DocumentStatus.InReview]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [DocumentStatus.Approved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [DocumentStatus.Archived]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
