import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonneService } from '../../services/personne.service';
import { Personne } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-personne-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './personne-detail.component.html',
    styleUrls: ['./personne-detail.component.css']
})
export class PersonneDetailComponent implements OnInit {
    personne: Personne | null = null;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private personneService: PersonneService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        if (id) {
            this.loadPersonne(+id);
        }
    }

    loadPersonne(id: number): void {
        this.personneService.getPersonneById(id).subscribe({
            next: (personne: Personne) => {
                this.personne = personne;
                this.isLoading = false;
            },
            error: (error: any) => {
                this.toastr.error('Erreur lors du chargement de la personne');
                this.isLoading = false;
            }
        });
    }

    onEdit(): void {
        if (this.personne) {
            this.router.navigate(['/admin/personnes/edit', this.personne.id]);
        }
    }

    onDelete(): void {
        if (this.personne && confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
            this.personneService.deletePersonne(this.personne.id!).subscribe({
                next: () => {
                    this.toastr.success('Personne supprimée avec succès');
                    this.router.navigate(['/admin/personnes']);
                },
                error: (error: any) => {
                    this.toastr.error('Erreur lors de la suppression');
                }
            });
        }
    }

    onBack(): void {
        this.router.navigate(['/admin/personnes']);
    }

    verifyPersonne(): void {
        if (this.personne) {
            this.personneService.verifyPersonne(this.personne.id!).subscribe({
                next: () => {
                    this.toastr.success('Personne vérifiée avec succès');
                    this.loadPersonne(this.personne!.id!);
                },
                error: (error: any) => {
                    this.toastr.error('Erreur lors de la vérification');
                }
            });
        }
    }

    unverifyPersonne(): void {
        if (this.personne) {
            this.personneService.unverifyPersonne(this.personne.id!).subscribe({
                next: () => {
                    this.toastr.success('Vérification supprimée avec succès');
                    this.loadPersonne(this.personne!.id!);
                },
                error: (error: any) => {
                    this.toastr.error('Erreur lors de la suppression de la vérification');
                }
            });
        }
    }
}