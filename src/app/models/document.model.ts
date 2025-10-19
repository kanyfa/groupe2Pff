export interface Document {
  id?: number;
  type: DocumentType;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DocumentType {
  CARTE_IDENTITE = 'CARTE_IDENTITE',
  PASSEPORT = 'PASSEPORT',
  CARTE_GRISE = 'CARTE_GRISE',
  DIPLOME = 'DIPLOME',
  PERMIS_CONDUIRE = 'PERMIS_CONDUIRE',
  CARTE_VITALE = 'CARTE_VITALE',
  AUTRE = 'AUTRE'
}

export const DocumentTypeLabels = {
  [DocumentType.CARTE_IDENTITE]: 'Carte Nationale d\'Identité',
  [DocumentType.PASSEPORT]: 'Passeport',
  [DocumentType.CARTE_GRISE]: 'Certificat d\'Immatriculation',
  [DocumentType.DIPLOME]: 'Diplôme/Certificat',
  [DocumentType.PERMIS_CONDUIRE]: 'Permis de Conduire',
  [DocumentType.CARTE_VITALE]: 'Carte d\'Assurance Maladie',
  [DocumentType.AUTRE]: 'Autre Document'
};
