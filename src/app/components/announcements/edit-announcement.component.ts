import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { DocumentType, DocumentTypeLabels } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-announcement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-announcement.component.html',
  styleUrls: ['./edit-announcement.component.css']
})
export class EditAnnouncementComponent implements OnInit {
  announcementForm: FormGroup;
  isLoading = false;
  documentTypes = Object.values(DocumentType);
  documentTypeLabels = DocumentTypeLabels;
  announcementId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.announcementForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      documentType: ['', [Validators.required]],
      documentName: ['', [Validators.required, Validators.minLength(2)]],
      lostDate: ['', [Validators.required]],
      lostLocation: ['', [Validators.required, Validators.minLength(3)]],
      contactPhone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
      contactEmail: ['', [Validators.email]],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.announcementId = +id;
      this.loadAnnouncement(+id);
    }
  }

  loadAnnouncement(id: number): void {
    this.announcementService.getAnnouncementById(id).subscribe({
      next: (announcement) => {
        this.announcementForm.patchValue({
          title: announcement.title,
          description: announcement.description,
          documentType: announcement.documentType,
          documentName: announcement.documentName,
          lostDate: this.formatDateForInput((announcement as any).lossDate || (announcement as any).lostDate),
          lostLocation: (announcement as any).lossLocation || (announcement as any).lostLocation,
          contactPhone: announcement.contactPhone,
          contactEmail: announcement.contactEmail,
          imageUrl: announcement.imageUrl
        });
      },
      error: (error) => {
        this.toastr.error('Annonce non trouvée');
        this.router.navigate(['/announcements']);
      }
    });
  }

  formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.announcementForm.valid && this.announcementId) {
      this.isLoading = true;
      const payload = this.announcementForm.value as any;
      
      this.announcementService.updateAnnouncement(this.announcementId, payload).subscribe({
        next: (response) => {
          this.toastr.success('Annonce modifiée avec succès !');
          this.router.navigate(['/announcements', this.announcementId]);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la modification de l\'annonce.');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  selectDocumentType(type: DocumentType): void {
    this.announcementForm.patchValue({ documentType: type });
  }

  getDocumentIcon(type: DocumentType): string {
    const iconMap: { [key in DocumentType]: string } = {
      [DocumentType.CARTE_IDENTITE]: 'fas fa-id-card text-primary',
      [DocumentType.PASSEPORT]: 'fas fa-passport text-danger',
      [DocumentType.CARTE_GRISE]: 'fas fa-car text-success',
      [DocumentType.DIPLOME]: 'fas fa-graduation-cap text-warning',
      [DocumentType.PERMIS_CONDUIRE]: 'fas fa-id-badge text-info',
      [DocumentType.CARTE_VITALE]: 'fas fa-heartbeat text-success',
      [DocumentType.AUTRE]: 'fas fa-file-alt text-secondary'
    };
    return iconMap[type] || 'fas fa-file-alt text-secondary';
  }

  get title() { return this.announcementForm.get('title'); }
  get description() { return this.announcementForm.get('description'); }
  get documentType() { return this.announcementForm.get('documentType'); }
  get documentName() { return this.announcementForm.get('documentName'); }
  get lostDate() { return this.announcementForm.get('lostDate'); }
  get lostLocation() { return this.announcementForm.get('lostLocation'); }
  get contactPhone() { return this.announcementForm.get('contactPhone'); }
  get contactEmail() { return this.announcementForm.get('contactEmail'); }
}
