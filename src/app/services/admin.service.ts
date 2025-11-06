import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Announcement, User, PaginatedResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getAdminUrl();
  }

  // Announcement management
  getAllAnnouncementsForModeration(): Observable<PaginatedResponse<Announcement>> {
    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/announcements`);
  }

  approveAnnouncement(id: number): Observable<Announcement> {
    return this.http.patch<Announcement>(`${this.apiUrl}/announcements/${id}/approve`, {});
  }

  rejectAnnouncement(id: number, reason: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/announcements/${id}/reject`, { reason });
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/announcements/${id}`);
  }

  // User management
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  suspendUser(userId: number, reason: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}/suspend`, { reason });
  }

  activateUser(userId: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}/activate`, {});
  }

  // Statistics
  getStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`);
  }

  // User management - additional methods
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  createAdmin(adminData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/admin`, adminData);
  }

  // Additional admin methods from Swagger
  moderateAnnouncement(annonceId: number, moderationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/annonces/${annonceId}/moderate`, moderationData);
  }

  markExpiredAnnouncements(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/annonces/mark-expired`, {});
  }

  getExpiredAnnouncements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/annonces/expired`);
  }

  changeUserRole(userId: number, role: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  testRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/test/roles`);
  }
}
