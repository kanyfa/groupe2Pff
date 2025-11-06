import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { AnnouncementService } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';
import { Announcement, AnnouncementStatus, DocumentTypeLabels } from '../../models';
import { ToastrService } from 'ngx-toastr';

interface FilterOptions {
  documentType: string;
  location: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './announcements-list.component.html',
  styleUrls: ['./announcements-list.component.css']
})
export class AnnouncementsListComponent implements OnInit {
  announcements: Announcement[] = [];
  isLoading = true;
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;
  documentTypeLabels = DocumentTypeLabels;

  // Filters
  filters: FilterOptions = {
    documentType: '',
    location: '',
    date: '',
    status: ''
  };

  // Sorting
  sortBy = 'createdAt';
  sortDir = 'desc';

  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private configService: ConfigService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('AnnouncementsListComponent - ngOnInit');
    console.log('Is authenticated:', this.authService.isAuthenticated());
    console.log('Token:', this.authService.getToken());

    // Vérifier l'authentification avant de charger les annonces
    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.currentPage = 0;
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    console.log('Chargement des annonces depuis l\'API...');
    console.log('Current page:', this.currentPage, 'Page size:', this.pageSize);
    console.log('Sort by:', this.sortBy, 'Sort dir:', this.sortDir);

    // Ajouter un petit délai pour éviter les problèmes de cache/propagation
    setTimeout(() => {
      console.log('Making API call after timeout...');
      // Charger toutes les annonces publiques avec tri
      this.announcementService.getAllAnnouncements(this.currentPage, this.pageSize, this.sortBy, this.sortDir).subscribe({
        next: (response) => {
          console.log('Toutes les annonces chargées:', response);
          console.log('Response type:', typeof response);
          console.log('Response keys:', response ? Object.keys(response) : 'null');

          // Gérer la réponse paginée
          if (response && response.content && Array.isArray(response.content)) {
            this.announcements = response.content;
            this.totalPages = response.totalPages || 0;
            this.totalElements = response.totalElements || 0;
            console.log('Response format: paginated with content array');
          } else if (Array.isArray(response)) {
            this.announcements = response;
            this.totalPages = Math.ceil(response.length / this.pageSize);
            this.totalElements = response.length;
            console.log('Response format: simple array');
          } else {
            console.log('Format de réponse inattendu:', response);
            this.announcements = [];
            this.totalPages = 0;
            this.totalElements = 0;
          }

          console.log(`${this.announcements.length} annonces chargées`);
          console.log('Annonces:', this.announcements);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des annonces:', error);
          console.error('Status:', error.status);
          console.error('Error details:', error);

          // Tentative de fallback : appel direct avec token d'authentification
          console.log('Tentative de fallback : appel direct...');
          const token = this.authService.getToken();
          console.log('Token for fallback:', token ? 'present' : 'null');

          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
          });

          console.log('Making fallback HTTP call...');
          this.http.get<any>(this.configService.getAnnouncementsUrl(), {
            headers: headers,
            params: new HttpParams()
              .set('page', this.currentPage.toString())
              .set('size', this.pageSize.toString())
              .set('sortBy', this.sortBy)
              .set('sortDir', this.sortDir)
          }).subscribe({
            next: (directResponse: any) => {
              console.log('Réponse directe:', directResponse);
              if (directResponse && directResponse.content && Array.isArray(directResponse.content)) {
                this.announcements = directResponse.content;
                this.totalPages = directResponse.totalPages || 0;
                this.totalElements = directResponse.totalElements || 0;
              } else if (Array.isArray(directResponse)) {
                this.announcements = directResponse;
                this.totalPages = Math.ceil(directResponse.length / this.pageSize);
                this.totalElements = directResponse.length;
              } else {
                this.announcements = [];
                this.totalPages = 0;
                this.totalElements = 0;
              }
              console.log(`${this.announcements.length} annonces chargées via appel direct`);
              this.isLoading = false;
            },
            error: (directError: any) => {
              console.error('Erreur même avec appel direct:', directError);
              this.announcements = [];
              this.totalPages = 0;
              this.totalElements = 0;
              this.isLoading = false;
            }
          });
        }
      });
    }, 500); // Délai de 500ms pour éviter les problèmes de cache
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAnnouncements();
  }

  viewAnnouncement(id: number): void {
    this.router.navigate(['/announcements', id]);
  }

  getStatusBadgeClass(status: AnnouncementStatus): string {
    switch (status) {
      case AnnouncementStatus.ACTIVE:
        return 'badge-success';
      case AnnouncementStatus.RESOLVED:
        return 'badge-info';
      case AnnouncementStatus.EXPIRED:
        return 'badge-warning';
      case AnnouncementStatus.CANCELLED:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusLabel(status: AnnouncementStatus): string {
    switch (status) {
      case AnnouncementStatus.ACTIVE:
        return 'Active';
      case AnnouncementStatus.RESOLVED:
        return 'Résolue';
      case AnnouncementStatus.EXPIRED:
        return 'Expirée';
      case AnnouncementStatus.CANCELLED:
        return 'Annulée';
      default:
        return 'Inconnue';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.loadAnnouncements();
  }

  clearFilters(): void {
    this.filters = {
      documentType: '',
      location: '',
      date: '',
      status: ''
    };
    this.currentPage = 0;
    this.loadAnnouncements();
  }

  onSortChange(): void {
    this.currentPage = 0;
    this.loadAnnouncements();
  }

  getActiveAnnouncementsCount(): number {
    return this.announcements.filter(a => a.status === 'ACTIVE').length;
  }

  getResolvedAnnouncementsCount(): number {
    return this.announcements.filter(a => a.status === 'RESOLVED').length;
  }

  isOwner(announcement: Announcement): boolean {
    return announcement.userId === this.authService.getCurrentUser()?.id;
  }

  markAsResolved(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir marquer cette annonce comme résolue ?')) {
      this.announcementService.markAsResolved(id).subscribe({
        next: (updatedAnnouncement) => {
          const index = this.announcements.findIndex(a => a.id === id);
          if (index !== -1) {
            this.announcements[index] = updatedAnnouncement;
          }
          this.toastr.success('Annonce marquée comme résolue');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la résolution');
        }
      });
    }
  }

  extendAnnouncement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir prolonger cette annonce ?')) {
      this.announcementService.extendAnnouncement(id).subscribe({
        next: (updatedAnnouncement) => {
          const index = this.announcements.findIndex(a => a.id === id);
          if (index !== -1) {
            this.announcements[index] = updatedAnnouncement;
          }
          this.toastr.success('Annonce prolongée avec succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la prolongation');
        }
      });
    }
  }

  cancelAnnouncement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette annonce ?')) {
      this.announcementService.cancelAnnouncement(id).subscribe({
        next: (updatedAnnouncement) => {
          const index = this.announcements.findIndex(a => a.id === id);
          if (index !== -1) {
            this.announcements[index] = updatedAnnouncement;
          }
          this.toastr.success('Annonce annulée avec succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'annulation');
        }
      });
    }
  }
  deleteAnnouncement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          this.announcements = this.announcements.filter(a => a.id !== id);
          this.totalElements--;
          this.toastr.success('Annonce supprimée avec succès');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }
}

