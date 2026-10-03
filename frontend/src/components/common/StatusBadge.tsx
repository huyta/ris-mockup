import React from 'react';
import { StudyStatus } from '../../types/portal';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

interface StatusBadgeProps {
  status: StudyStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'REPORTED':
      return (
        <span className="badge badge-reported">
          <CheckCircle2 size={12} />
          Reported
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="badge badge-in_progress">
          <Clock size={12} />
          In Progress
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className="badge badge-scheduled">
          <Calendar size={12} />
          Scheduled
        </span>
      );
    default:
      return <span className="badge">{status}</span>;
  }
};
