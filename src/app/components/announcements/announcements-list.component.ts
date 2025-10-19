import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { Announcement, AnnouncementStatus, DocumentTypeLabels } from '../../models';

@Component({
  selector: 'app-announcements-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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

  constructor(
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAnnouncements();
  }

  loadAnnouncements(): void {
    this.isLoading = true;
    this.announcementService.getAllAnnouncements(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.announcements = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des annonces:', error);
        this.isLoading = false;
      }
    });
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
}
