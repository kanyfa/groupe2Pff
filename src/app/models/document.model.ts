export interface Document {
  id?: number;
  documentType: string;
  documentNumber: string;
  holderName: string;
  holderFirstName: string;
  issueDate?: Date;
  expiryDate?: Date;
  issuingAuthority?: string;
  description?: string;
  status: DocumentStatus;
  isFound: boolean;
  foundDate?: Date;
  foundBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DocumentStatus {
  LOST = 'LOST',
  FOUND = 'FOUND',
  RETURNED = 'RETURNED'
}

export interface CreateDocumentRequest {
  documentType: string;
  documentNumber: string;
  holderName: string;
  holderFirstName: string;
  issueDate?: Date;
  expiryDate?: Date;
  issuingAuthority?: string;
  description?: string;
}

export interface UpdateDocumentRequest {
  documentType?: string;
  documentNumber?: string;
  holderName?: string;
  holderFirstName?: string;
  issueDate?: Date;
  expiryDate?: Date;
  issuingAuthority?: string;
  description?: string;
  status?: DocumentStatus;
}

export enum DocumentType {
  CARTE_IDENTITE = 'CARTE_IDENTITE',
  PASSEPORT = 'PASSEPORT',
  PERMIS_CONDUIRE = 'PERMIS_CONDUIRE',
  CARTE_VITALE = 'CARTE_VITALE',
  CARTE_GRISE = 'CARTE_GRISE',
  DIPLOME = 'DIPLOME',
  AUTRE = 'AUTRE'
}

export interface DocumentTypeInfo {
  id: number;
  name: string;
  description?: string;
}

export interface DocumentStats {
  totalCount: number;
  byType: { [key: string]: number };
  byStatus: { [key: string]: number };
  foundCount: number;
  lostCount: number;
}

export interface PageDocument {
  content: Document[];
  pageable: DocumentPageable;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface DocumentPageable {
  sort: DocumentSortObject;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface DocumentSortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}