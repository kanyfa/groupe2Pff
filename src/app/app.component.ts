import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sama Papier';
  private unreadMessageCount = 0;
  private unreadNotificationCount = 0;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadUnreadCounts();
    }
  }

  private initializeApp(): void {
    // Check if user is already logged in on app start
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        // User is authenticated, redirect based on role
        if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
          this.router.navigate(['/admin-panel']);
        } else {
          this.router.navigate(['/announcements']);
        }
      }
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isModerator(): boolean {
    return this.authService.isModerator();
  }

  isSuperAdmin(): boolean {
    return this.authService.isSuperAdmin();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }


  private loadUnreadCounts(): void {
    // Load unread message count
    this.messageService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadMessageCount = count;
      },
      error: (error) => {
        console.error('Error loading unread message count:', error);
        // For demo purposes, set a sample count
        this.unreadMessageCount = 2;
      }
    });

    // For notifications, we'll use a simple counter for now
    // In a real app, you'd have a notification service
    this.unreadNotificationCount = 1;
  }

  getUnreadMessageCount(): number {
    return this.unreadMessageCount;
  }

  getUnreadNotificationCount(): number {
    return this.unreadNotificationCount;
  }

  logout(): void {
    console.log('Logging out...');
    // Logout locally first for immediate effect
    this.authService.logoutLocal();
    this.router.navigate(['/login']);

    // Then call API logout in background (don't wait for it)
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout API call successful');
      },
      error: (error) => {
        console.error('Logout API call failed:', error);
        // User is already logged out locally, so this is fine
      }
    });
  }
}
