import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { PersonneService } from '../../services/personne.service';
import { DocumentTypeInfo, Personne } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-document-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './document-create.component.html',
    styleUrls: ['./document-create.component.css']
})
export class DocumentCreateComponent implements OnInit {
    documentForm: FormGroup;
    isSubmitting = false;
    documentTypes: DocumentTypeInfo[] = [];
    personnes: Personne[] = [];

    constructor(
        private fb: FormBuilder,
        private documentService: DocumentService,
        private personneService: PersonneService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.documentForm = this.fb.group({
            documentType: ['', Validators.required],
            documentNumber: ['', Validators.required],
            holderId: ['', Validators.required],
            description: [''],
            isUrgent: [false]
        });
    }

    ngOnInit(): void {
        this.loadDocumentTypes();
        this.loadPersonnes();
    }

    loadDocumentTypes(): void {
        this.documentService.getDocumentTypes().subscribe({
            next: (types) => {
                this.documentTypes = types;
            },
            error: (error) => {
                this.toastr.error('Erreur lors du chargement des types de documents');
            }
        });
    }

    loadPersonnes(): void {
        this.personneService.getAllPersonnesList().subscribe({
            next: (personnes: any) => {
                this.personnes = personnes;
            },
            error: (error: any) => {
                this.toastr.error('Erreur lors du chargement des personnes');
            }
        });
    }

    onSubmit(): void {
        if (this.documentForm.valid) {
            this.isSubmitting = true;
            const formData = this.documentForm.value;
            const selectedPersonne = this.personnes.find(p => p.id === +formData.holderId);

            if (!selectedPersonne) {
                this.toastr.error('Personne sélectionnée introuvable');
                this.isSubmitting = false;
                return;
            }

            const documentData = {
                documentType: formData.documentType,
                documentNumber: formData.documentNumber,
                holderName: selectedPersonne.lastName,
                holderFirstName: selectedPersonne.firstName,
                description: formData.description
            };

            this.documentService.createDocument(documentData).subscribe({
                next: () => {
                    this.toastr.success('Document créé avec succès');
                    this.router.navigate(['/admin/documents']);
                },
                error: (error) => {
                    this.toastr.error('Erreur lors de la création du document');
                    this.isSubmitting = false;
                }
            });
        } else {
            this.toastr.error('Veuillez corriger les erreurs du formulaire');
        }
    }

    onCancel(): void {
        this.router.navigate(['/admin/documents']);
    }

    getHolderName(holderId: number): string {
        const personne = this.personnes.find(p => p.id === holderId);
        return personne ? `${personne.firstName} ${personne.lastName}` : '';
    }
}