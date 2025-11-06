import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import {
    Personne,
    CreatePersonneRequest,
    UpdatePersonneRequest,
    PersonneStats,
    PagePersonne
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class PersonneService {
    private readonly apiUrl: string;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.apiUrl = this.configService.getApiUrl();
    }

    // CRUD Operations
    getAllPersonnes(page: number = 0, size: number = 10, sort?: string): Observable<PagePersonne> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());

        if (sort) {
            params = params.set('sort', sort);
        }

        return this.http.get<PagePersonne>(`${this.apiUrl}/api/personnes`, { params });
    }

    getPersonneById(id: number): Observable<Personne> {
        return this.http.get<Personne>(`${this.apiUrl}/api/personnes/${id}`);
    }

    createPersonne(personne: CreatePersonneRequest): Observable<Personne> {
        return this.http.post<Personne>(`${this.apiUrl}/api/personnes`, personne);
    }

    updatePersonne(id: number, personne: UpdatePersonneRequest): Observable<Personne> {
        return this.http.put<Personne>(`${this.apiUrl}/api/personnes/${id}`, personne);
    }

    deletePersonne(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/api/personnes/${id}`);
    }

    // Search Operations
    searchPersonnes(query: string, page: number = 0, size: number = 10): Observable<PagePersonne> {
        let params = new HttpParams()
            .set('query', query)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<PagePersonne>(`${this.apiUrl}/api/personnes/search`, { params });
    }

    getAllPersonnesList(): Observable<Personne[]> {
        return this.http.get<Personne[]>(`${this.apiUrl}/api/personnes/all`);
    }

    // Verification Operations
    verifyPersonne(id: number): Observable<Personne> {
        return this.http.post<Personne>(`${this.apiUrl}/api/personnes/${id}/verify`, {});
    }

    unverifyPersonne(id: number): Observable<Personne> {
        return this.http.post<Personne>(`${this.apiUrl}/api/personnes/${id}/unverify`, {});
    }

    // Statistics
    getPersonneStats(): Observable<PersonneStats> {
        return this.http.get<PersonneStats>(`${this.apiUrl}/api/personnes/stats`);
    }
}