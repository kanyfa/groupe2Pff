import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AnnouncementService } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';
import { CreateAnnouncementRequest, DocumentType, DocumentTypeLabels } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-announcement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-announcement.component.html',
  styleUrls: ['./create-announcement.component.css']
})
export class CreateAnnouncementComponent implements OnInit {
  announcementForm: FormGroup;
  isLoading = false;
  documentTypes = Object.values(DocumentType);
  documentTypeLabels = DocumentTypeLabels;
  documentTypesList: string[] = [
    "Carte d'identité",
    'Passeport',
    'Permis de conduire',
    'Carte vitale',
    'Carte grise',
    'Diplôme',
    'Carte bancaire',
    'Titre de séjour',
    "Carte d'étudiant",
    'Autres'
  ];
  private labelToEnum: { [label: string]: DocumentType } = {
    "Carte d'identité": DocumentType.CARTE_IDENTITE,
    'Passeport': DocumentType.PASSEPORT,
    'Permis de conduire': DocumentType.PERMIS_CONDUIRE,
    'Carte vitale': DocumentType.CARTE_VITALE,
    'Carte grise': DocumentType.CARTE_GRISE,
    'Diplôme': DocumentType.DIPLOME,
    'Carte bancaire': DocumentType.AUTRE,
    'Titre de séjour': DocumentType.AUTRE,
    "Carte d'étudiant": DocumentType.AUTRE,
    'Autres': DocumentType.AUTRE
  };

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
      this.announcementForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(10)]],
        // Document imbriqué (saisi via nos champs)
        documentType: ['', [Validators.required]],
        documentNumber: [''],
        holderName: ['', [Validators.required, Validators.minLength(2)]],
        holderFirstName: [''],
        customDocumentLabel: [''],
        // Champs de perte (alignés sur backend)
        lossDate: ['', [Validators.required]],
        lossLocation: ['', [Validators.required, Validators.minLength(3)]],
        lossCity: [''],
        lossPostalCode: [''],
        isUrgent: [false],
        status: ['ACTIVE'],
        contactPreference: ['EMAIL'],
        contactPhone: ['', [Validators.pattern(/^[0-9+\-\s()]+$/)]],
        contactEmail: ['', [Validators.email]],
        imageUrl: ['']
      });
  }

  ngOnInit(): void {}

      onSubmit(): void {
        if (this.announcementForm.valid) {
          this.isLoading = true;
          
          // Debug: vérifier l'authentification
          const token = this.authService.getToken();
          const user = this.authService.getCurrentUser();
          console.log('Token:', token);
          console.log('User:', user);
          console.log('Is authenticated:', this.authService.isAuthenticated());
          
          const form = this.announcementForm.value as any;
      const announcement: CreateAnnouncementRequest = {
        title: form.title,
        description: form.description,
        lossDate: form.lossDate,
        lossLocation: form.lossLocation,
        lossCity: form.lossCity,
        lossPostalCode: form.lossPostalCode,
        isUrgent: form.isUrgent,
        status: form.status,
        contactPreference: form.contactPreference,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        imageUrl: form.imageUrl,
        document: {
          documentType: form.documentType,
          documentNumber: form.documentNumber,
          holderName: form.holderName,
          holderFirstName: form.holderFirstName
        }
      };
      
          console.log('[CreateAnnouncement] payload sent:', announcement);
          this.announcementService.createAnnouncement(announcement).subscribe({
            next: (response) => {
              this.toastr.success('Annonce créée avec succès !');
            const newId = (response as any)?.id;
            if (newId && Number.isFinite(Number(newId))) {
              this.router.navigate(['/announcements', newId]);
            } else {
              this.toastr.info("Annonce créée, mais identifiant non renvoyé. Ouverture de la liste.");
              this.router.navigate(['/announcements']);
            }
            },
            error: (error) => {
              console.error('[CreateAnnouncement] error:', error);
              const status = error?.status;
              const message = error?.error?.message || error?.message || 'Erreur inconnue';
              this.toastr.error(`Erreur (${status}): ${message}`);
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

  onDocumentTypeChangeFromLabel(label: string): void {
    const value = this.labelToEnum[label] ?? DocumentType.AUTRE;
    const isNative = value !== DocumentType.AUTRE ? true : ['Autres'].includes(label);
    this.announcementForm.patchValue({
      documentType: value,
      customDocumentLabel: isNative ? '' : label
    });
  }

  onSelectDocumentType(event: Event): void {
    const select = event.target as HTMLSelectElement;
    if (!select) { return; }
    const label = select.value;
    this.onDocumentTypeChangeFromLabel(label);
  }

  handleDocumentTypeInput(input: string): void {
    if (!input) {
      this.announcementForm.patchValue({ documentType: '', customDocumentLabel: '' });
      return;
    }
    const normalized = input.trim().toLowerCase();
    const foundLabel = this.documentTypesList.find((label: string) => label.toLowerCase() === normalized);
    if (foundLabel) {
      this.onDocumentTypeChangeFromLabel(foundLabel);
    } else {
      // Not a native label → map to AUTRE but keep label
      this.announcementForm.patchValue({ documentType: DocumentType.AUTRE, customDocumentLabel: input });
    }
  }

  onDocumentTypeInput(event: Event): void {
    const inputEl = event.target as HTMLInputElement | null;
    const value = inputEl ? inputEl.value : '';
    this.handleDocumentTypeInput(value);
  }

  logout(): void {
    this.authService.logout();
    this.toastr.info('Déconnecté');
    this.router.navigate(['/login']);
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
  get holderName() { return this.announcementForm.get('holderName'); }
  get lossDate() { return this.announcementForm.get('lossDate'); }
  get lossLocation() { return this.announcementForm.get('lossLocation'); }
  get contactPhone() { return this.announcementForm.get('contactPhone'); }
  get contactEmail() { return this.announcementForm.get('contactEmail'); }
}
