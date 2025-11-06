import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AuthInterceptor } from './app/interceptors/auth.interceptor';
import { AuthGuard, AdminGuard } from './app/guards';

// Routes
const routes: Routes = [
  { path: '', loadComponent: () => import('./app/components/home/home.component').then(m => m.HomeComponent), pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./app/components/auth/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./app/components/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'announcements', loadComponent: () => import('./app/components/announcements/announcements-list.component').then(m => m.AnnouncementsListComponent) },
  { path: 'announcements/create', loadComponent: () => import('./app/components/announcements/create-announcement.component').then(m => m.CreateAnnouncementComponent), canActivate: [AuthGuard] },
  { path: 'announcements/edit/:id', loadComponent: () => import('./app/components/announcements/edit-announcement.component').then(m => m.EditAnnouncementComponent), canActivate: [AuthGuard] },
  { path: 'announcements/:id', loadComponent: () => import('./app/components/announcements/announcement-detail.component').then(m => m.AnnouncementDetailComponent) },
  { path: 'announcements/history', loadComponent: () => import('./app/components/announcements/announcement-history.component').then(m => m.AnnouncementHistoryComponent), canActivate: [AuthGuard] },
  { path: 'profile', loadComponent: () => import('./app/components/profile/user-profile.component').then(m => m.UserProfileComponent), canActivate: [AuthGuard] },
  { path: 'messages', loadComponent: () => import('./app/components/messages/messages.component').then(m => m.MessagesComponent), canActivate: [AuthGuard] },
  { path: 'notifications', loadComponent: () => import('./app/components/notifications/notifications.component').then(m => m.NotificationsComponent), canActivate: [AuthGuard] },
  { path: 'how-it-works', loadComponent: () => import('./app/components/pages/how-it-works.component').then(m => m.HowItWorksComponent) },
  { path: 'contact', loadComponent: () => import('./app/components/pages/contact.component').then(m => m.ContactComponent) },
  { path: 'unauthorized', loadComponent: () => import('./app/components/pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: 'admin', loadComponent: () => import('./app/components/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [AdminGuard], data: { role: 'MODERATOR' } },
  { path: 'admin-panel', loadComponent: () => import('./app/components/admin/admin.component').then(m => m.AdminComponent) },
  { path: 'admin/statistics', loadComponent: () => import('./app/components/admin/admin-statistics.component').then(m => m.AdminStatisticsComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: 'admin/users', loadComponent: () => import('./app/components/admin/admin-users.component').then(m => m.AdminUsersComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: 'admin/personnes', loadComponent: () => import('./app/components/admin/personne-list.component').then(m => m.PersonneListComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: 'admin/personnes/create', loadComponent: () => import('./app/components/admin/personne-create.component').then(m => m.PersonneCreateComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: 'admin/personnes/:id', loadComponent: () => import('./app/components/admin/personne-detail.component').then(m => m.PersonneDetailComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: 'admin/documents', loadComponent: () => import('./app/components/admin/document-list.component').then(m => m.DocumentListComponent), canActivate: [AdminGuard], data: { role: 'MODERATOR' } },
  { path: 'admin/documents/create', loadComponent: () => import('./app/components/admin/document-create.component').then(m => m.DocumentCreateComponent), canActivate: [AdminGuard], data: { role: 'ADMIN' } },
  { path: '**', redirectTo: '/announcements' }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      FormsModule,
      BrowserAnimationsModule,
      RouterModule.forRoot(routes),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),
      NgxSpinnerModule
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
