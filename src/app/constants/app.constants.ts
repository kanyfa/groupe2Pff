// Constantes de l'application Sama Papier
export const APP_CONSTANTS = {
  // Configuration de l'application
  APP_NAME: 'Sama Papier',
  APP_VERSION: '1.0.0',
  
  // Configuration JWT
  JWT_TOKEN_KEY: 'token',
  JWT_USER_KEY: 'user',
  JWT_EXPIRATION_KEY: 'expiration',
  
  // Configuration des rôles
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
    MODERATOR: 'MODERATOR'
  },
  
  // Configuration des statuts d'annonces
  ANNOUNCEMENT_STATUS: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    RESOLVED: 'RESOLVED',
    EXPIRED: 'EXPIRED'
  },
  
  // Configuration des types de documents
  DOCUMENT_TYPES: {
    IDENTITY_CARD: 'IDENTITY_CARD',
    PASSPORT: 'PASSPORT',
    DRIVER_LICENSE: 'DRIVER_LICENSE',
    BIRTH_CERTIFICATE: 'BIRTH_CERTIFICATE',
    MARRIAGE_CERTIFICATE: 'MARRIAGE_CERTIFICATE',
    DIPLOMA: 'DIPLOMA',
    BANK_CARD: 'BANK_CARD',
    INSURANCE_CARD: 'INSURANCE_CARD',
    OTHER: 'OTHER'
  },
  
  // Configuration des notifications
  NOTIFICATION_TYPES: {
    NEW_MESSAGE: 'NEW_MESSAGE',
    ANNOUNCEMENT_APPROVED: 'ANNOUNCEMENT_APPROVED',
    ANNOUNCEMENT_REJECTED: 'ANNOUNCEMENT_REJECTED',
    MATCH_FOUND: 'MATCH_FOUND',
    SYSTEM_ANNOUNCEMENT: 'SYSTEM_ANNOUNCEMENT'
  },
  
  // Configuration des tailles de fichiers
  FILE_SIZES: {
    MAX_PROFILE_PICTURE: 5 * 1024 * 1024, // 5MB
    MAX_DOCUMENT_IMAGE: 10 * 1024 * 1024, // 10MB
    MAX_ANNOUNCEMENT_IMAGE: 10 * 1024 * 1024 // 10MB
  },
  
  // Configuration des formats de fichiers autorisés
  ALLOWED_FILE_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  },
  
  // Configuration de la pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    DEFAULT_PAGE: 0
  },
  
  // Configuration des messages
  MESSAGES: {
    SUCCESS: {
      LOGIN_SUCCESS: 'Connexion réussie',
      LOGOUT_SUCCESS: 'Déconnexion réussie',
      REGISTER_SUCCESS: 'Inscription réussie',
      PROFILE_UPDATED: 'Profil mis à jour avec succès',
      ANNOUNCEMENT_CREATED: 'Annonce créée avec succès',
      ANNOUNCEMENT_UPDATED: 'Annonce mise à jour avec succès',
      ANNOUNCEMENT_DELETED: 'Annonce supprimée avec succès',
      MESSAGE_SENT: 'Message envoyé avec succès'
    },
    ERROR: {
      LOGIN_FAILED: 'Échec de la connexion',
      REGISTER_FAILED: 'Échec de l\'inscription',
      UNAUTHORIZED: 'Accès non autorisé',
      FORBIDDEN: 'Accès interdit',
      NOT_FOUND: 'Ressource non trouvée',
      SERVER_ERROR: 'Erreur du serveur',
      NETWORK_ERROR: 'Erreur de réseau',
      VALIDATION_ERROR: 'Erreur de validation',
      FILE_TOO_LARGE: 'Fichier trop volumineux',
      INVALID_FILE_TYPE: 'Type de fichier non autorisé'
    },
    INFO: {
      LOADING: 'Chargement...',
      SAVING: 'Sauvegarde...',
      UPLOADING: 'Téléchargement...',
      SEARCHING: 'Recherche...'
    }
  },
  
  // Configuration des routes
  ROUTES: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    ANNOUNCEMENTS: '/announcements',
    CREATE_ANNOUNCEMENT: '/announcements/create',
    EDIT_ANNOUNCEMENT: '/announcements/edit',
    ANNOUNCEMENT_DETAIL: '/announcements',
    ANNOUNCEMENT_HISTORY: '/announcements/history',
    PROFILE: '/profile',
    MESSAGES: '/messages',
    NOTIFICATIONS: '/notifications',
    HOW_IT_WORKS: '/how-it-works',
    CONTACT: '/contact',
    ADMIN: '/admin'
  },
  
  // Configuration des API endpoints
  API_ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    ANNOUNCEMENTS: {
      BASE: '/announcements',
      SEARCH: '/announcements/search',
      USER: '/announcements/user',
      RESOLVE: '/announcements/resolve'
    },
    MESSAGES: {
      BASE: '/messages',
      CONVERSATIONS: '/messages/conversations',
      UNREAD_COUNT: '/messages/unread-count'
    },
    USERS: {
      PROFILE: '/users/profile',
      PICTURE: '/users/profile/picture',
      NOTIFICATIONS: '/users/notifications/settings'
    },
    ADMIN: {
      ANNOUNCEMENTS: '/admin/announcements',
      USERS: '/admin/users',
      STATISTICS: '/admin/statistics'
    },
    UPLOAD: {
      PROFILE_PICTURE: '/upload/profile-picture',
      ANNOUNCEMENT_IMAGE: '/upload/announcement-image',
      DOCUMENT_IMAGE: '/upload/document-image'
    }
  },
  
  // Configuration des validations
  VALIDATION: {
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL_CHAR: true
    },
    EMAIL: {
      PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    PHONE: {
      PATTERN: /^[+]?[0-9\s\-\(\)]{10,}$/
    },
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-ZÀ-ÿ\s\-']+$/
    }
  },
  
  // Configuration des timeouts
  TIMEOUTS: {
    HTTP_REQUEST: 30000, // 30 secondes
    TOAST_DISPLAY: 3000, // 3 secondes
    SPINNER_DISPLAY: 1000, // 1 seconde
    AUTO_SAVE: 5000 // 5 secondes
  },
  
  // Configuration des couleurs
  COLORS: {
    PRIMARY: '#007bff',
    SECONDARY: '#6c757d',
    SUCCESS: '#28a745',
    DANGER: '#dc3545',
    WARNING: '#ffc107',
    INFO: '#17a2b8',
    LIGHT: '#f8f9fa',
    DARK: '#343a40'
  }
};

// Constantes pour les environnements
export const ENVIRONMENT_CONSTANTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Constantes pour les headers HTTP
export const HTTP_HEADERS = {
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  ACCEPT: 'Accept',
  CACHE_CONTROL: 'Cache-Control',
  X_REQUESTED_WITH: 'X-Requested-With'
};

// Constantes pour les types de contenu
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
  TEXT_PLAIN: 'text/plain'
};

