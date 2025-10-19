import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  isLoading = true;

  constructor() {}

  ngOnInit(): void {
    // Simuler le chargement des notifications
    setTimeout(() => {
      this.notifications = [
        {
          id: 1,
          type: 'message',
          title: 'Nouveau message reçu',
          content: 'Vous avez reçu un message concernant votre annonce "Carte d\'identité perdue"',
          date: new Date('2024-10-13T10:30:00'),
          isRead: false,
          icon: 'fas fa-comment',
          color: 'text-primary'
        },
        {
          id: 2,
          type: 'match',
          title: 'Document potentiellement trouvé',
          content: 'Une personne pense avoir trouvé votre passeport perdu le 10/10/2024',
          date: new Date('2024-10-12T15:45:00'),
          isRead: false,
          icon: 'fas fa-search',
          color: 'text-success'
        },
        {
          id: 3,
          type: 'system',
          title: 'Annonce approuvée',
          content: 'Votre annonce "Diplôme perdu" a été approuvée et est maintenant visible',
          date: new Date('2024-10-11T09:15:00'),
          isRead: true,
          icon: 'fas fa-check-circle',
          color: 'text-info'
        },
        {
          id: 4,
          type: 'reminder',
          title: 'Rappel de mise à jour',
          content: 'N\'oubliez pas de mettre à jour vos informations de contact',
          date: new Date('2024-10-10T14:20:00'),
          isRead: true,
          icon: 'fas fa-bell',
          color: 'text-warning'
        }
      ];
      this.isLoading = false;
    }, 1000);
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
