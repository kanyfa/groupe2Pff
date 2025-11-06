import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    statistics: any = {};
    users: any[] = [];
    announcements: any[] = [];

    constructor(
        public authService: AuthService,
        private adminService: AdminService,
        private http: HttpClient,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        console.log('Admin component initialized');
        console.log('Current user:', this.authService.getCurrentUser());
        console.log('Is authenticated:', this.authService.isAuthenticated());
        console.log('Has admin role:', this.authService.hasRole('ADMIN'));

        this.loadStatistics();
        this.loadUsers();
        this.loadAnnouncements();
    }

    loadStatistics() {
        this.adminService.getStatistics().subscribe({
            next: (stats) => {
                this.statistics = stats;
            },
            error: (error) => {
                this.toastr.error('Erreur lors du chargement des statistiques');
            }
        });
    }

    loadUsers() {
        this.adminService.getAllUsers().subscribe({
            next: (users) => {
                console.log('Users received:', users);
                this.users = users;
            },
            error: (error) => {
                console.error('Error loading users:', error);
                this.toastr.error('Erreur lors du chargement des utilisateurs');
                this.users = [];
            }
        });
    }

    loadAnnouncements() {
        this.adminService.getAllAnnouncementsForModeration().subscribe({
            next: (response) => {
                console.log('Announcements response:', response);
                if (response && response.content) {
                    this.announcements = response.content.slice(0, 10); // Afficher seulement les 10 dernières
                } else {
                    this.announcements = [];
                }
            },
            error: (error) => {
                console.error('Error loading announcements:', error);
                this.toastr.error('Erreur lors du chargement des annonces');
                this.announcements = [];
            }
        });
    }

    changeUserRole(userId: number, event: Event) {
        const target = event.target as HTMLSelectElement;
        const newRole = target.value;
        this.adminService.changeUserRole(userId, newRole).subscribe({
            next: () => {
                this.toastr.success('Rôle modifié avec succès');
                this.loadUsers();
            },
            error: (error) => {
                this.toastr.error('Erreur lors de la modification du rôle');
            }
        });
    }

    activateUser(userId: number) {
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

    suspendUser(userId: number) {
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

    approveAnnouncement(announcementId: number) {
        this.adminService.approveAnnouncement(announcementId).subscribe({
            next: () => {
                this.toastr.success('Annonce approuvée');
                this.loadAnnouncements();
            },
            error: (error) => {
                this.toastr.error('Erreur lors de l\'approbation');
            }
        });
    }

    rejectAnnouncement(announcementId: number) {
        const reason = prompt('Raison du rejet:');
        if (reason) {
            this.adminService.rejectAnnouncement(announcementId, reason).subscribe({
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

    deleteAnnouncement(announcementId: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
            this.adminService.deleteAnnouncement(announcementId).subscribe({
                next: () => {
                    this.toastr.success('Annonce supprimée');
                    this.loadAnnouncements();
                },
                error: (error) => {
                    this.toastr.error('Erreur lors de la suppression');
                }
            });
        }
    }

    getRoleColor(role: string): string {
        // Vérifier si role est défini
        if (!role) return '#6c757d'; // Gris par défaut

        // Enlever le préfixe ROLE_ si présent
        const cleanRole = role.replace('ROLE_', '');

        switch (cleanRole) {
            case 'USER': return '#007bff'; // Bleu
            case 'MODERATOR': return '#17a2b8'; // Cyan
            case 'ADMIN': return '#ffc107'; // Jaune
            case 'SUPER_ADMIN': return '#dc3545'; // Rouge
            default: return '#6c757d'; // Gris
        }
    }

    getRoleTextColor(role: string): string {
        if (!role) return '#ffffff'; // Blanc par défaut

        const cleanRole = role.replace('ROLE_', '');

        switch (cleanRole) {
            case 'ADMIN': return '#000000'; // Texte noir pour le jaune
            default: return '#ffffff'; // Texte blanc pour les autres
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
            case 'PENDING': return '#6c757d'; // Gris
            case 'APPROVED': return '#28a745'; // Vert
            case 'REJECTED': return '#dc3545'; // Rouge
            default: return '#6c757d'; // Gris
        }
    }
}