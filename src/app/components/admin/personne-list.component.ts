import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonneService } from '../../services/personne.service';
import { Personne, PagePersonne } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-personne-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './personne-list.component.html',
  styleUrls: ['./personne-list.component.css']
})
export class PersonneListComponent implements OnInit {
  personnes: Personne[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  isLoading = false;
  searchQuery = '';
  sortField = 'lastName';
  sortDirection = 'asc';

  constructor(
    private personneService: PersonneService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPersonnes();
  }

  loadPersonnes(): void {
    this.isLoading = true;
    const sort = `${this.sortField},${this.sortDirection}`;

    this.personneService.getAllPersonnes(this.currentPage, this.pageSize, sort).subscribe({
      next: (page: PagePersonne) => {
        this.personnes = page.content;
        this.totalElements = page.totalElements;
        this.totalPages = page.totalPages;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.toastr.error('Erreur lors du chargement des personnes');
        this.isLoading = false;
      }
    });
  }

  searchPersonnes(): void {
    if (this.searchQuery.trim()) {
      this.isLoading = true;
      this.personneService.searchPersonnes(this.searchQuery, this.currentPage, this.pageSize).subscribe({
        next: (page: PagePersonne) => {
          this.personnes = page.content;
          this.totalElements = page.totalElements;
          this.totalPages = page.totalPages;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.toastr.error('Erreur lors de la recherche');
          this.isLoading = false;
        }
      });
    } else {
      this.loadPersonnes();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 0;
    this.loadPersonnes();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchQuery.trim()) {
      this.searchPersonnes();
    } else {
      this.loadPersonnes();
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
    this.loadPersonnes();
  }

  verifyPersonne(id: number): void {
    this.personneService.verifyPersonne(id).subscribe({
      next: () => {
        this.toastr.success('Personne vérifiée avec succès');
        this.loadPersonnes();
      },
      error: (error: any) => {
        this.toastr.error('Erreur lors de la vérification');
      }
    });
  }

  unverifyPersonne(id: number): void {
    this.personneService.unverifyPersonne(id).subscribe({
      next: () => {
        this.toastr.success('Vérification supprimée avec succès');
        this.loadPersonnes();
      },
      error: (error: any) => {
        this.toastr.error('Erreur lors de la suppression de la vérification');
      }
    });
  }

  deletePersonne(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
      this.personneService.deletePersonne(id).subscribe({
        next: () => {
          this.toastr.success('Personne supprimée avec succès');
          this.loadPersonnes();
        },
        error: (error: any) => {
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages - 1, this.currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}



