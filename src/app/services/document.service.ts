import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import {
  Document,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  DocumentTypeInfo,
  DocumentStats,
  PageDocument,
  DocumentStatus
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }

  // CRUD Operations
  getAllDocuments(page: number = 0, size: number = 10, sort?: string): Observable<PageDocument> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageDocument>(`${this.apiUrl}/api/documents`, { params });
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/api/documents/${id}`);
  }

  createDocument(document: CreateDocumentRequest): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/api/documents`, document);
  }

  updateDocument(id: number, document: UpdateDocumentRequest): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/api/documents/${id}`, document);
  }

  deleteDocument(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/documents/${id}`);
  }

  // Search and Filter Operations
  searchDocuments(query: string, page: number = 0, size: number = 10): Observable<PageDocument> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageDocument>(`${this.apiUrl}/api/documents/search`, { params });
  }

  getDocumentsByType(documentType: string, page: number = 0, size: number = 10): Observable<PageDocument> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageDocument>(`${this.apiUrl}/api/documents/type/${documentType}`, { params });
  }

  getDocumentByNumber(documentNumber: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/api/documents/number/${documentNumber}`);
  }

  getDocumentByName(documentName: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/api/documents/name/${documentName}`);
  }

  getDocumentsByHolder(holderName: string, page: number = 0, size: number = 10): Observable<PageDocument> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageDocument>(`${this.apiUrl}/api/documents/holder/${holderName}`, { params });
  }

  getDocumentsByHolderFirstName(holderFirstName: string, page: number = 0, size: number = 10): Observable<PageDocument> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageDocument>(`${this.apiUrl}/api/documents/holder-first-name/${holderFirstName}`, { params });
  }

  getAllDocumentsList(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.apiUrl}/api/documents/all`);
  }

  // Document Types
  getDocumentTypes(): Observable<DocumentTypeInfo[]> {
    return this.http.get<DocumentTypeInfo[]>(`${this.apiUrl}/api/documents/types`);
  }

  // Statistics
  getDocumentStats(): Observable<DocumentStats> {
    return this.http.get<DocumentStats>(`${this.apiUrl}/api/documents/stats/count`);
  }

  getStatsByType(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/api/documents/stats/by-type`);
  }

  // Status Operations
  markAsFound(id: number, foundBy?: string): Observable<Document> {
    const body = foundBy ? { foundBy } : {};
    return this.http.post<Document>(`${this.apiUrl}/api/documents/${id}/found`, body);
  }

  markAsReturned(id: number): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/api/documents/${id}/returned`, {});
  }
}
