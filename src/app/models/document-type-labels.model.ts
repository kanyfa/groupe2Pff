import { DocumentType } from './document.model';

export const DocumentTypeLabels: { [key in DocumentType]: string } = {
  [DocumentType.CARTE_IDENTITE]: "Carte d'identité",
  [DocumentType.PASSEPORT]: 'Passeport',
  [DocumentType.PERMIS_CONDUIRE]: 'Permis de conduire',
  [DocumentType.CARTE_VITALE]: 'Carte vitale',
  [DocumentType.CARTE_GRISE]: 'Carte grise',
  [DocumentType.DIPLOME]: 'Diplôme',
  [DocumentType.AUTRE]: 'Autre'
};

export const DocumentTypeIcons: { [key in DocumentType]: string } = {
  [DocumentType.CARTE_IDENTITE]: 'fas fa-id-card text-primary',
  [DocumentType.PASSEPORT]: 'fas fa-passport text-danger',
  [DocumentType.PERMIS_CONDUIRE]: 'fas fa-id-badge text-info',
  [DocumentType.CARTE_VITALE]: 'fas fa-heartbeat text-success',
  [DocumentType.CARTE_GRISE]: 'fas fa-car text-success',
  [DocumentType.DIPLOME]: 'fas fa-graduation-cap text-warning',
  [DocumentType.AUTRE]: 'fas fa-file-alt text-secondary'
};



