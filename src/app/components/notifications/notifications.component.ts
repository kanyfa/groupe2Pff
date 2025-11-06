import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AnnouncementService } from '../../services/announcement.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

interface Notification {
  id: number;
  type: 'message' | 'match' | 'system' | 'reminder';
  title: string;
  content: string;
  date: Date;
  isRead: boolean;
  icon: string;
  color: string;
  relatedId?: number;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  isLoading = true;

  constructor(
    private messageService: MessageService,
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log('NotificationsComponent - ngOnInit');
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;
    console.log('Loading notifications...');

    // Charger les conversations pour les notifications de messages
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        console.log('Conversations loaded:', conversations);

        // Créer des notifications basées sur les conversations
        const messageNotifications: Notification[] = conversations.map((conv, index) => ({
          id: index + 1,
          type: 'message' as const,
          title: 'Nouveau message reçu',
          content: `Vous avez un message concernant "${conv.announcement.title}"`,
          date: new Date(conv.updatedAt),
          isRead: conv.unreadCount === 0,
          icon: 'fas fa-comment',
          color: 'text-primary',
          relatedId: conv.announcement.id
        }));

        // Charger les annonces de l'utilisateur pour d'autres types de notifications
        this.announcementService.getMyAnnouncements().subscribe({
          next: (response) => {
            console.log('User announcements loaded:', response);

            const announcements = Array.isArray(response) ? response : response.content || [];
            const systemNotifications: Notification[] = announcements.map((announcement, index) => ({
              id: messageNotifications.length + index + 1,
              type: 'system' as const,
              title: 'Annonce active',
              content: `Votre annonce "${announcement.title}" est toujours active`,
              date: new Date(announcement.createdAt!),
              isRead: true,
              icon: 'fas fa-check-circle',
              color: 'text-info',
              relatedId: announcement.id
            }));

            // Combiner toutes les notifications
            this.notifications = [...messageNotifications, ...systemNotifications];

            // Trier par date (plus récentes en premier)
            this.notifications.sort((a, b) => b.date.getTime() - a.date.getTime());

            console.log('All notifications loaded:', this.notifications);
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading user announcements:', error);
            // Utiliser seulement les notifications de messages
            this.notifications = messageNotifications;
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.toastr.error('Erreur lors du chargement des notifications');
        this.notifications = [];
        this.isLoading = false;
      }
    });
  }

  markAsRead(notification: any): void {
    notification.isRead = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
  }

  deleteNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}
