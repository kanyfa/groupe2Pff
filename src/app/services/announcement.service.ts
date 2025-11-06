import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { Announcement, CreateAnnouncementRequest, AnnouncementSearchFilters, PaginatedResponse, AnnouncementStats } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getAnnouncementsUrl();
  }

  getAllAnnouncements(page: number = 0, size: number = 10, sortBy: string = 'createdAt', sortDir: string = 'desc'): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PaginatedResponse<Announcement>>(this.apiUrl, { params });
  }

  getAnnouncementById(id: number): Observable<Announcement> {
    return this.http.get<Announcement>(`${this.apiUrl}/${id}`);
  }

  createAnnouncement(announcement: CreateAnnouncementRequest): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, announcement);
  }

  updateAnnouncement(id: number, announcement: Partial<Announcement>): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, announcement);
  }

  deleteAnnouncement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchAnnouncements(filters: AnnouncementSearchFilters, page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.documentType) {
      params = params.set('documentType', filters.documentType.toString());
    }
    if (filters.documentName) {
      params = params.set('documentName', filters.documentName);
    }
    if (filters.lostLocation) {
      params = params.set('lostLocation', filters.lostLocation);
    }
    if (filters.dateFrom) {
      params = params.set('dateFrom', filters.dateFrom.toISOString());
    }
    if (filters.dateTo) {
      params = params.set('dateTo', filters.dateTo.toISOString());
    }
    if (filters.status) {
      params = params.set('status', filters.status);
    }

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/search`, { params });
  }

  getUserAnnouncements(userId: number): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/user/${userId}`);
  }

  markAsResolved(id: number): Observable<Announcement> {
    return this.http.patch<Announcement>(`${this.apiUrl}/${id}/resolve`, {});
  }

  getUrgentAnnouncements(page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/urgent`, { params });
  }

  getAnnouncementStats(): Observable<AnnouncementStats> {
    return this.http.get<AnnouncementStats>(`${this.apiUrl}/stats`);
  }

  getMyAnnouncements(page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/my-announcements`, { params });
  }

  getAnnouncementsByType(type: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/by-type/${type}`, { params });
  }

  getAnnouncementsByHolder(holderName: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/by-holder/${holderName}`, { params });
  }

  getAnnouncementsByCity(city: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<Announcement>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse<Announcement>>(`${this.apiUrl}/by-city/${city}`, { params });
  }

  extendAnnouncement(id: number): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.apiUrl}/${id}/extend`, {});
  }

  cancelAnnouncement(id: number): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.apiUrl}/${id}/cancel`, {});
  }

  // Additional announcement methods from Swagger
  updateAnnouncementStatus(id: number, status: string): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}/status`, { status });
  }
}
