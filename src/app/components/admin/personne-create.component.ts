import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonneService } from '../../services/personne.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-personne-create',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './personne-create.component.html',
    styleUrls: ['./personne-create.component.css']
})
export class PersonneCreateComponent implements OnInit {
    personneForm: FormGroup;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private personneService: PersonneService,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.personneForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            address: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', Validators.required],
            country: ['Sénégal', Validators.required]
        });
    }

    ngOnInit(): void { }

    onSubmit(): void {
        if (this.personneForm.valid) {
            this.isSubmitting = true;
            const personneData = this.personneForm.value;

            this.personneService.createPersonne(personneData).subscribe({
                next: () => {
                    this.toastr.success('Personne créée avec succès');
                    this.router.navigate(['/admin/personnes']);
                },
                error: (error: any) => {
                    this.toastr.error('Erreur lors de la création de la personne');
                    this.isSubmitting = false;
                }
            });
        } else {
            this.toastr.error('Veuillez corriger les erreurs du formulaire');
        }
    }

    onCancel(): void {
        this.router.navigate(['/admin/personnes']);
    }
}