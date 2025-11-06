import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-users',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-users.component.html',
    styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    searchQuery = '';
    currentPage = 0;
    totalPages = 0;
    totalElements = 0;
    pageSize = 10;
    isLoading = true;

    // Admin creation modal
    showCreateAdminModal = false;
    adminForm: FormGroup;
    isCreatingAdmin = false;

    constructor(
        private adminService: AdminService,
        private toastr: ToastrService,
        private fb: FormBuilder
    ) {
        this.adminForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, { validators: this.passwordMatchValidator });

    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.adminService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.filteredUsers = users;
                this.totalElements = users.length;
                this.totalPages = Math.ceil(this.totalElements / this.pageSize);
                this.isLoading = false;
            },
            error: (error) => {
                this.toastr.error('Erreur lors du chargement des utilisateurs');
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        if (this.searchQuery.trim()) {
            this.filteredUsers = this.users.filter(user =>
                user.firstName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                user.lastName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        } else {
            this.filteredUsers = this.users;
        }
        this.totalElements = this.filteredUsers.length;
        this.totalPages = Math.ceil(this.totalElements / this.pageSize);
        this.currentPage = 0;
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.onSearch();
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

    deleteUser(userId: number): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => {
                    this.toastr.success('Utilisateur supprimé');
                    this.loadUsers();
                },
                error: (error) => {
                    this.toastr.error('Erreur lors de la suppression');
                }
            });
        }
    }

    onPageChange(page: number): void {
        this.currentPage = page;
    }

    getPaginatedUsers(): User[] {
        const startIndex = this.currentPage * this.pageSize;
        return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
    }

    getPageNumbers(): number[] {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(0, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    }

    // Password match validator
    passwordMatchValidator(form: AbstractControl): { [key: string]: any } | null {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (password && confirmPassword && password.value !== confirmPassword.value) {
            return { passwordMismatch: true };
        }
        return null;
    }

    // Modal methods
    closeCreateAdminModal(): void {
        this.showCreateAdminModal = false;
        this.adminForm.reset();
    }

    createAdmin(): void {
        if (this.adminForm.valid) {
            this.isCreatingAdmin = true;
            const adminData = {
                firstName: this.adminForm.value.firstName,
                lastName: this.adminForm.value.lastName,
                email: this.adminForm.value.email,
                phone: this.adminForm.value.phone,
                password: this.adminForm.value.password,
                isActive: true,
                isVerified: true,
                role: 'ADMIN'
            };

            this.adminService.createAdmin(adminData).subscribe({
                next: () => {
                    this.toastr.success('Administrateur créé avec succès');
                    this.isCreatingAdmin = false;
                    this.closeCreateAdminModal();
                    this.loadUsers();
                },
                error: (error) => {
                    this.toastr.error('Erreur lors de la création de l\'administrateur');
                    this.isCreatingAdmin = false;
                }
            });
        } else {
            this.toastr.error('Veuillez corriger les erreurs du formulaire');
        }
    }

}