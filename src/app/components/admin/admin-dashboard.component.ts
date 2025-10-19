import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { Announcement, User, PaginatedResponse } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  statistics: any = {};
  announcements: Announcement[] = [];
  users: User[] = [];
  isLoading = true;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadAnnouncements();
    this.loadUsers();
  }

  loadStatistics(): void {
    this.adminService.getStatistics().subscribe({
      next: (stats) => {
        this.statistics = stats;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des statistiques');
      }
    });
  }

  loadAnnouncements(): void {
    this.adminService.getAllAnnouncementsForModeration().subscribe({
      next: (response: PaginatedResponse<Announcement>) => {
        this.announcements = response.content.slice(0, 5); // Afficher seulement les 5 dernières
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des annonces');
      }
    });
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users.slice(0, 5); // Afficher seulement les 5 derniers
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des utilisateurs');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  approveAnnouncement(id: number): void {
    this.adminService.approveAnnouncement(id).subscribe({
      next: () => {
        this.toastr.success('Annonce approuvée');
        this.loadAnnouncements();
      },
      error: (error) => {
        this.toastr.error('Erreur lors de l\'approbation');
      }
    });
  }

  rejectAnnouncement(id: number): void {
    const reason = prompt('Raison du rejet:');
    if (reason) {
      this.adminService.rejectAnnouncement(id, reason).subscribe({
        next: () => {
          this.toastr.success('Annonce rejetée');
          this.loadAnnouncements();
        },
        error: (error) => {
          this.toastr.error('Erreur lors du rejet');
        }
      });
    }
  }

  suspendUser(userId: number): void {
    const reason = prompt('Raison de la suspension:');
    if (reason) {
      this.adminService.suspendUser(userId, reason).subscribe({
        next: () => {
          this.toastr.success('Utilisateur suspendu');
          this.loadUsers();
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suspension');
        }
      });
    }
  }

  activateUser(userId: number): void {
    this.adminService.activateUser(userId).subscribe({
      next: () => {
        this.toastr.success('Utilisateur activé');
        this.loadUsers();
      },
      error: (error) => {
        this.toastr.error('Erreur lors de l\'activation');
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
