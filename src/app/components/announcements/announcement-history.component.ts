import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';
import { Announcement, AnnouncementStatus, DocumentTypeLabels } from '../../models';

@Component({
  selector: 'app-announcement-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './announcement-history.component.html',
  styleUrls: ['./announcement-history.component.css']
})
export class AnnouncementHistoryComponent implements OnInit {
  announcements: Announcement[] = [];
  isLoading = true;
  documentTypeLabels = DocumentTypeLabels;

  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadUserAnnouncements();
  }

  loadUserAnnouncements(): void {
    this.isLoading = true;
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.announcementService.getUserAnnouncements(currentUser.id).subscribe({
        next: (announcements) => {
          this.announcements = announcements;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des annonces:', error);
          this.announcements = [];
          this.isLoading = false;
        }
      });
    } else {
      this.announcements = [];
      this.isLoading = false;
    }
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

  markAsResolved(id: number): void {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) {
      announcement.status = 'RESOLVED' as any;
    }
  }

  deleteAnnouncement(id: number): void {
    this.announcements = this.announcements.filter(a => a.id !== id);
  }

  getActiveCount(): number {
    return this.announcements.filter(a => a.status === 'ACTIVE').length;
  }

  getResolvedCount(): number {
    return this.announcements.filter(a => a.status === 'RESOLVED').length;
  }

  getExpiredCount(): number {
    return this.announcements.filter(a => a.status === 'EXPIRED').length;
  }
}
