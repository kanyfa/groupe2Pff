import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-statistics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-statistics.component.html',
    styleUrls: ['./admin-statistics.component.css']
})
export class AdminStatisticsComponent implements OnInit {
    statistics: any = {};
    isLoading = true;

    constructor(
        private adminService: AdminService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.loadStatistics();
    }

    loadStatistics(): void {
        this.adminService.getStatistics().subscribe({
            next: (stats) => {
                this.statistics = stats;
                this.isLoading = false;
            },
            error: (error) => {
                this.toastr.error('Erreur lors du chargement des statistiques');
                this.isLoading = false;
            }
        });
    }
}