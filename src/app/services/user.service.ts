import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { User, NotificationSettings } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getUsersUrl();
  }

  getCurrentUserProfile(): Observable<User> {
    console.log('UserService - calling getCurrentUserProfile:', `${this.apiUrl}/profile`);
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user);
  }

  uploadProfilePicture(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/profile/picture`, formData);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.apiUrl}/notifications/settings`);
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.apiUrl}/notifications/settings`, settings);
  }

  // Admin methods
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/all`);
  }

  updateUserStatus(userId: number, isActive: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/admin/${userId}/status`, { isActive });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/${userId}`);
  }


  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/active`);
  }

  changePassword(changePasswordRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, changePasswordRequest);
  }
}
