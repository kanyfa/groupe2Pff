import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { Document, PageDocument, DocumentStatus } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  searchQuery = '';
  sortField = 'createdAt';
  sortDirection = 'desc';
  DocumentStatus = DocumentStatus;

  constructor(
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    const sort = `${this.sortField},${this.sortDirection}`;

    this.documentService.getAllDocuments(this.currentPage, this.pageSize, sort).subscribe({
      next: (page: PageDocument) => {
        this.documents = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erreur lors du chargement des documents');
        this.isLoading = false;
      }
    });
  }

  searchDocuments(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.documentService.searchDocuments(this.searchQuery, this.currentPage, this.pageSize).subscribe({
        next: (page: PageDocument) => {
          this.documents = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Erreur lors de la recherche');
          this.isLoading = false;
        }
      });
    } else {
      this.loadDocuments();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadDocuments();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchQuery.trim()) {
      this.searchDocuments();
    } else {
      this.loadDocuments();
    }
  }

  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 0;
    this.loadDocuments();
  }

  deleteDocument(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.toastr.success('Document supprimé avec succès');
          this.loadDocuments();
        },
        error: () => {
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }

  markAsFound(id: number): void {
    this.documentService.markAsFound(id).subscribe({
      next: () => {
        this.toastr.success('Document marqué comme retrouvé');
        this.loadDocuments();
      },
      error: () => this.toastr.error('Erreur lors de la mise à jour')
    });
  }

  markAsReturned(id: number): void {
    this.documentService.markAsReturned(id).subscribe({
      next: () => {
        this.toastr.success('Document marqué comme restitué');
        this.loadDocuments();
      },
      error: () => this.toastr.error('Erreur lors de la mise à jour')
    });
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }
}






