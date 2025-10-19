export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  newAnnouncementNearby: boolean;
  messageReceived: boolean;
  announcementResolved: boolean;
}
