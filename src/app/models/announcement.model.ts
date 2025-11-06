import { DocumentType } from './document.model';

export interface Announcement {
  id?: number;
  title: string;
  description: string;
  lossDate?: Date;
  lossLocation?: string;
  lossCity?: string;
  lossPostalCode?: string;
  rewardAmount?: number;
  rewardDescription?: string;
  contactPreference?: string;
  status?: AnnouncementStatus;
  contactPhone?: string;
  contactEmail?: string;
  documentPath?: string;
  document?: {
    documentType: DocumentType;
    documentNumber?: string;
    holderName: string;
    holderFirstName?: string;
    description?: string;
  };
  // Champs plats pour compatibilité
  documentType?: DocumentType;
  holderFirstName?: string;
  holderName?: string;
  documentNumber?: string;
  urgent?: boolean;
  userId?: number;
  user?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum AnnouncementStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export interface CreateAnnouncementRequest {
  title: string;
  description: string;
  lossDate: string;
  lossLocation: string;
  lossCity?: string;
  lossPostalCode?: string;
  rewardAmount?: number;
  rewardDescription?: string;
  contactPreference?: string;
  status?: string;
  contactPhone?: string;
  contactEmail?: string;
  documentPath?: string;
  document: {
    documentType: DocumentType;
    documentNumber?: string;
    holderName: string;
    holderFirstName?: string;
    description?: string;
  };
  documentType?: DocumentType;
  holderFirstName?: string;
  holderName?: string;
  documentNumber?: string;
  urgent?: boolean;
}

export interface AnnouncementSearchFilters {
  documentType?: DocumentType;
  documentName?: string;
  lostLocation?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: AnnouncementStatus;
}

export interface AnnouncementStats {
  totalAnnouncements?: number;
  activeAnnouncements?: number;
  resolvedAnnouncements?: number;
  expiredAnnouncements?: number;
  cancelledAnnouncements?: number;
  urgentAnnouncements?: number;
}
