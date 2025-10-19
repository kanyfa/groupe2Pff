import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnnouncementService } from '../../services/announcement.service';
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

  constructor(private announcementService: AnnouncementService) {}

  ngOnInit(): void {
    this.loadUserAnnouncements();
  }

  loadUserAnnouncements(): void {
    // Simuler le chargement des annonces de l'utilisateur
    setTimeout(() => {
      this.announcements = [
        {
          id: 1,
          title: 'Carte d\'identité perdue à Dakar',
          description: 'Carte d\'identité française perdue dans le métro ligne 1',
          documentType: 'CARTE_IDENTITE' as any,
          documentName: 'Jean Dupont',
          lostDate: new Date('2024-10-10'),
          lostLocation: 'Dakar, Plateau',
          status: 'ACTIVE' as any,
          createdAt: new Date('2024-10-10'),
          userId: 1
        },
        {
          id: 2,
          title: 'Passeport perdu à l\'aéroport',
          description: 'Passeport français perdu à l\'aéroport Charles de Gaulle',
          documentType: 'PASSEPORT' as any,
          documentName: 'Marie Martin',
          lostDate: new Date('2024-10-08'),
          lostLocation: 'Aéroport CDG, Terminal 2',
          status: 'RESOLVED' as any,
          createdAt: new Date('2024-10-08'),
          userId: 1
        },
        {
          id: 3,
          title: 'Diplôme universitaire perdu',
          description: 'Diplôme de Master en Informatique perdu lors d\'un déménagement',
          documentType: 'DIPLOME' as any,
          documentName: 'Pierre Durand',
          lostDate: new Date('2024-10-05'),
          lostLocation: 'Lyon, Quartier Part-Dieu',
          status: 'ACTIVE' as any,
          createdAt: new Date('2024-10-05'),
          userId: 1
        }
      ];
      this.isLoading = false;
    }, 1000);
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
