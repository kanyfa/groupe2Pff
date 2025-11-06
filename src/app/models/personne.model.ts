export interface Personne {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  postalCode: string;
  country: string;
  isVerified: boolean;
  verificationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePersonneRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface UpdatePersonneRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface PersonneStats {
  totalCount: number;
  verifiedCount: number;
  unverifiedCount: number;
  byCity: { [key: string]: number };
}

export interface PagePersonne {
  content: Personne[];
  pageable: PersonnePageable;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PersonnePageable {
  sort: PersonneSortObject;
  offset: number;
  pageSize: number;
  pageNumber: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PersonneSortObject {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}
