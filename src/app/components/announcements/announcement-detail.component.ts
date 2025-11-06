import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { MessageService } from '../../services/message.service';
import { Announcement, DocumentTypeLabels, CreateMessageRequest, AnnouncementStatus } from '../../models';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcement-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './announcement-detail.component.html',
  styleUrls: ['./announcement-detail.component.css']
})
export class AnnouncementDetailComponent implements OnInit {
  announcement: Announcement | null = null;
  isLoading = true;
  messageForm: FormGroup;
  showMessageForm = false;
  documentTypeLabels = DocumentTypeLabels;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private announcementService: AnnouncementService,
    private messageService: MessageService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.messageForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idNum = idParam !== null ? Number(idParam) : NaN;
    if (Number.isFinite(idNum)) {
      this.loadAnnouncement(idNum);
    } else {
      this.toastr.warning("Identifiant d'annonce invalide");
      this.router.navigate(['/announcements']);
    }
  }

  loadAnnouncement(id: number): void {
    this.announcementService.getAnnouncementById(id).subscribe({
      next: (announcement) => {
        this.announcement = announcement;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Annonce non trouvée');
        this.router.navigate(['/announcements']);
      }
    });
  }

  toggleMessageForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastr.warning('Vous devez être connecté pour envoyer un message');
      this.router.navigate(['/login']);
      return;
    }
    this.showMessageForm = !this.showMessageForm;
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.announcement && this.announcement.userId) {
      const message: CreateMessageRequest = {
        content: this.messageForm.value.content,
        receiverId: this.announcement.userId,
        announcementId: this.announcement.id!
      };

      this.messageService.sendMessage(message).subscribe({
        next: () => {
          this.toastr.success('Message envoyé avec succès !');
          this.messageForm.reset();
          this.showMessageForm = false;
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'envoi du message');
        }
      });
    }
  }

  formatDate(date: Date | undefined): string {
    return date ? new Date(date).toLocaleDateString('fr-FR') : 'N/A';
  }

  getStatusBadgeClass(status: AnnouncementStatus | undefined): string {
    if (!status) return 'badge-secondary';
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

  getStatusLabel(status: AnnouncementStatus | undefined): string {
    if (!status) return 'Inconnue';
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

  canContact(): boolean {
    return this.announcement?.status === 'ACTIVE' &&
      this.announcement?.userId !== this.getCurrentUserId();
  }

  getCurrentUserId(): number | undefined {
    return this.authService.getCurrentUser()?.id;
  }

  isOwner(): boolean {
    return this.announcement?.userId === this.getCurrentUserId();
  }

  editAnnouncement(): void {
    if (this.announcement) {
      this.router.navigate(['/announcements/edit', this.announcement.id]);
    }
  }

  deleteAnnouncement(): void {
    if (this.announcement && confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      this.announcementService.deleteAnnouncement(this.announcement.id!).subscribe({
        next: () => {
          this.toastr.success('Annonce supprimée avec succès');
          this.router.navigate(['/announcements']);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la suppression');
        }
      });
    }
  }

  extendAnnouncement(): void {
    if (this.announcement && confirm('Êtes-vous sûr de vouloir prolonger cette annonce ?')) {
      this.announcementService.extendAnnouncement(this.announcement.id!).subscribe({
        next: (updatedAnnouncement) => {
          this.announcement = updatedAnnouncement;
          this.toastr.success('Annonce prolongée avec succès');
          // Reload the announcement to reflect changes
          this.loadAnnouncement(this.announcement!.id!);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la prolongation');
        }
      });
    }
  }

  cancelAnnouncement(): void {
    if (this.announcement && confirm('Êtes-vous sûr de vouloir annuler cette annonce ?')) {
      this.announcementService.cancelAnnouncement(this.announcement.id!).subscribe({
        next: (updatedAnnouncement) => {
          this.announcement = updatedAnnouncement;
          this.toastr.success('Annonce annulée avec succès');
          // Reload the announcement to reflect changes
          this.loadAnnouncement(this.announcement!.id!);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'annulation');
        }
      });
    }
  }

  get content() { return this.messageForm.get('content'); }

  getDocumentTypeLabel(documentType: any): string {
    if (!documentType) return 'Type inconnu';
    const label = this.documentTypeLabels[documentType as keyof typeof this.documentTypeLabels];
    return label || 'Type inconnu';
  }
}
