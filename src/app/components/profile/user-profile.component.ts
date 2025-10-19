import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User, Announcement, AnnouncementStatus } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User | null = null;
  isLoading = false;
  isEditing = false;
  recentAnnouncements: Announcement[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRecentAnnouncements();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        });
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement du profil');
      }
    });
  }

  loadRecentAnnouncements(): void {
    // Simuler le chargement des annonces récentes
    setTimeout(() => {
      this.recentAnnouncements = [
        {
          id: 1,
          title: 'Carte d\'identité perdue à Dakar',
          lostLocation: 'Dakar, Plateau',
          status: 'ACTIVE' as any,
          createdAt: new Date('2024-10-10'),
          userId: 1
        } as Announcement,
        {
          id: 2,
          title: 'Passeport perdu à l\'aéroport',
          lostLocation: 'Aéroport CDG, Terminal 2',
          status: 'RESOLVED' as any,
          createdAt: new Date('2024-10-08'),
          userId: 1
        } as Announcement
      ];
    }, 500);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserProfile();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updatedUser = this.profileForm.value;
      
      this.userService.updateProfile(updatedUser).subscribe({
        next: (user) => {
          this.user = user;
          this.authService.setAuthData({ token: this.authService.getToken()!, user });
          this.toastr.success('Profil mis à jour avec succès !');
          this.isEditing = false;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la mise à jour du profil');
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.uploadProfilePicture(file).subscribe({
        next: (imageUrl) => {
          this.user!.profilePicture = imageUrl;
          this.toastr.success('Photo de profil mise à jour !');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'upload de la photo');
        }
      });
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

  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get email() { return this.profileForm.get('email'); }
  get phone() { return this.profileForm.get('phone'); }
}
