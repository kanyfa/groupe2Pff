import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Message, CreateMessageRequest, Conversation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getMessagesUrl();
  }

  sendMessage(message: CreateMessageRequest): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  getMessagesByAnnouncement(announcementId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/announcement/${announcementId}`);
  }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getMessagesWithUser(userId: number, announcementId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation/${userId}/${announcementId}`);
  }

  markAsRead(messageId: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${messageId}/read`, {});
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }
}
