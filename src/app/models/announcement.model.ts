import { DocumentType } from './document.model';

export interface Announcement {
  id?: number;
  title: string;
  description: string;
  // Nouveau schéma backend
  lossDate?: Date;
  lossLocation?: string;
  lossCity?: string;
  lossPostalCode?: string;
  isUrgent?: boolean;
  contactPreference?: 'EMAIL' | 'PHONE' | 'BOTH';
  document?: {
    documentType: DocumentType;
    documentNumber?: string;
    holderName: string;
    holderFirstName?: string;
    description?: string;
  };
  // Compatibilité avec l'ancien schéma (champs plats)
  documentType?: DocumentType;
  documentName?: string;
  lostDate?: Date; // ancien
  lostLocation?: string; // ancien
  // Commun
  contactPhone?: string;
  contactEmail?: string;
  imageUrl?: string;
  status: AnnouncementStatus;
  userId: number;
  user?: any; // User interface will be imported where needed
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
  lossDate: string | Date;
  lossLocation: string;
  lossCity?: string;
  lossPostalCode?: string;
  isUrgent?: boolean;
  status?: 'ACTIVE' | 'RESOLVED' | 'EXPIRED' | 'CANCELLED';
  contactPreference?: 'EMAIL' | 'PHONE' | 'BOTH';
  contactPhone?: string;
  contactEmail?: string;
  imageUrl?: string;
  document: {
    documentType: DocumentType;
    documentNumber?: string;
    holderName: string;
    holderFirstName?: string;
    description?: string;
  };
}

export interface AnnouncementSearchFilters {
  documentType?: DocumentType;
  documentName?: string;
  lostLocation?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: AnnouncementStatus;
}
