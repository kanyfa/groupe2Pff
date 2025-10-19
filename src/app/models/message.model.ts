export interface Message {
  id?: number;
  content: string;
  senderId: number;
  receiverId: number;
  announcementId: number;
  sender?: any; // User interface will be imported where needed
  receiver?: any; // User interface will be imported where needed
  announcement?: any; // Announcement interface will be imported where needed
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateMessageRequest {
  content: string;
  receiverId: number;
  announcementId: number;
}

export interface Conversation {
  id: number;
  participant: any; // User interface will be imported where needed
  announcement: any; // Announcement interface will be imported where needed
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}
