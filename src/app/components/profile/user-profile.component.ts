import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { AnnouncementService } from '../../services/announcement.service';
import { User, Announcement, AnnouncementStatus, Message } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  quickMessageForm: FormGroup;
  user: User | null = null;
  isLoading = false;
  isEditing = false;
  isSendingQuickMessage = false;
  recentAnnouncements: Announcement[] = [];
  availableUsers: User[] = [];
  userAnnouncements: Announcement[] = [];
  recentMessages: Message[] = [];
  userNotifications: any[] = [];


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private messageService: MessageService,
    private announcementService: AnnouncementService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+221\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{2}\s?[0-9]{2}$/)]]
    });

    this.quickMessageForm = this.fb.group({
      recipientId: ['', Validators.required],
      announcementId: [''],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRecentAnnouncements();
    this.loadAvailableUsers();
    this.loadUserAnnouncements();
    this.loadRecentMessages();
    this.loadNotifications();
  }

  loadUserProfile(): void {
    console.log('Loading user profile...');
    // Try using auth service first
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('Using user from auth service:', currentUser);
      this.user = currentUser;
      this.profileForm.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone
      });
    } else {
      // Fallback to API call
      this.userService.getCurrentUserProfile().subscribe({
        next: (user) => {
          console.log('User loaded from API:', user);
          this.user = user;
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
          });
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.toastr.error('Erreur lors du chargement du profil');
        }
      });
    }
  }

  loadRecentAnnouncements(): void {
    // Simuler le chargement des annonces récentes
    setTimeout(() => {
      this.recentAnnouncements = [
        {
          id: 1,
          title: 'Carte d\'identité perdue à Dakar',
          description: 'Carte d\'identité perdue appartenant à Jean Dupont. Si vous la retrouvez, merci de contacter le propriétaire.',
          lossLocation: 'Dakar, Plateau',
          status: 'ACTIVE' as AnnouncementStatus,
          createdAt: new Date('2024-10-10'),
          userId: 1,
          documentType: 'CARTE_IDENTITE' as any,
          holderFirstName: 'Fatou',
          holderName: 'Diop',
          documentNumber: '123456789',
          urgent: false
        } as Announcement,
        {
          id: 2,
          title: 'Passeport perdu à l\'aéroport',
          description: 'Passeport perdu appartenant à Marie Martin. Document urgent à récupérer.',
          lossLocation: 'Aéroport CDG, Terminal 2',
          status: 'RESOLVED' as AnnouncementStatus,
          createdAt: new Date('2024-10-08'),
          userId: 1,
          documentType: 'PASSEPORT' as any,
          holderFirstName: 'Awa',
          holderName: 'Ba',
          documentNumber: 'P123456789',
          urgent: true
        } as Announcement
      ];
    }, 500);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserProfile();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const updatedUser = this.profileForm.value;

      this.userService.updateProfile(updatedUser).subscribe({
        next: (user) => {
          this.user = user;
          this.authService.setAuthData({ token: this.authService.getToken()!, user });
          this.toastr.success('Profil mis à jour avec succès !');
          this.isEditing = false;
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error('Erreur lors de la mise à jour du profil');
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userService.uploadProfilePicture(file).subscribe({
        next: (imageUrl) => {
          this.user!.profilePicture = imageUrl;
          this.toastr.success('Photo de profil mise à jour !');
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'upload de la photo');
        }
      });
    }
  }

  getStatusBadgeClass(status?: AnnouncementStatus): string {
    switch (status) {
      case AnnouncementStatus.ACTIVE:
        return 'badge-success';
      case AnnouncementStatus.RESOLVED:
        return 'badge-info';
      case AnnouncementStatus.EXPIRED:
        return 'badge-warning';
      case AnnouncementStatus.CANCELLED:
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusLabel(status?: AnnouncementStatus): string {
    switch (status) {
      case AnnouncementStatus.ACTIVE:
        return 'Active';
      case AnnouncementStatus.RESOLVED:
        return 'Résolue';
      case AnnouncementStatus.EXPIRED:
        return 'Expirée';
      case AnnouncementStatus.CANCELLED:
        return 'Annulée';
      default:
        return 'Inconnue';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
  }

  // Message and notification methods
  loadAvailableUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = this.authService.getCurrentUser();
        this.availableUsers = users.filter(u => u.id !== currentUser?.id);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Demo users for testing
        this.availableUsers = [
          { id: 2, firstName: 'Fatou', lastName: 'Diop', email: 'alice@example.com' } as User,
          { id: 3, firstName: 'Awa', lastName: 'Ba', email: 'bob@example.com' } as User
        ];
      }
    });
  }

  loadUserAnnouncements(): void {
    this.announcementService.getMyAnnouncements().subscribe({
      next: (response) => {
        if (response && response.content) {
          this.userAnnouncements = response.content;
        }
      },
      error: (error) => {
        console.error('Error loading user announcements:', error);
        // Demo announcements
        this.userAnnouncements = [
          { id: 1, title: 'Carte d\'identité perdue', description: 'Carte perdue près de la gare' } as Announcement,
          { id: 2, title: 'Permis de conduire trouvé', description: 'Permis trouvé dans un taxi' } as Announcement
        ];
      }
    });
  }

  loadRecentMessages(): void {
    // For demo purposes, simulate recent messages
    setTimeout(() => {
      this.recentMessages = [
        {
          id: 1,
          content: 'Bonjour, j\'ai trouvé votre carte d\'identité.',
          senderId: 2,
          receiverId: 1,
          isRead: false,
          createdAt: new Date('2024-10-15T10:30:00'),
          announcementId: 1
        } as Message,
        {
          id: 2,
          content: 'Merci pour votre aide précieuse.',
          senderId: 1,
          receiverId: 2,
          isRead: true,
          createdAt: new Date('2024-10-14T15:45:00'),
          announcementId: 2
        } as Message
      ];
    }, 1000);
  }

  loadNotifications(): void {
    // For demo purposes, simulate notifications
    setTimeout(() => {
      this.userNotifications = [
        {
          id: 1,
          title: 'Nouvelle annonce',
          message: 'Votre annonce a été approuvée par un modérateur.',
          createdAt: new Date('2024-10-15T09:00:00')
        },
        {
          id: 2,
          title: 'Message reçu',
          message: 'Vous avez reçu un nouveau message concernant votre annonce.',
          createdAt: new Date('2024-10-14T16:30:00')
        }
      ];
    }, 1000);
  }

  sendQuickMessage(): void {
    if (this.quickMessageForm.valid) {
      this.isSendingQuickMessage = true;
      const messageData = {
        receiverId: this.quickMessageForm.value.recipientId,
        announcementId: this.quickMessageForm.value.announcementId || null,
        content: this.quickMessageForm.value.content
      };

      this.messageService.sendMessage(messageData).subscribe({
        next: (message) => {
          this.toastr.success('Message envoyé avec succès');
          this.quickMessageForm.reset();

          // Simulate response after sending
          setTimeout(() => {
            const responseMessage = {
              id: Date.now(),
              content: 'Message bien reçu. Je vous répondrai bientôt.',
              senderId: messageData.receiverId,
              receiverId: 1,
              isRead: false,
              createdAt: new Date(),
              announcementId: messageData.announcementId
            } as Message;
            this.recentMessages.unshift(responseMessage);
            this.toastr.info('Nouveau message reçu');
          }, 3000);
          this.isSendingQuickMessage = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.toastr.success('Message envoyé (démonstration)');
          this.quickMessageForm.reset();
          this.isSendingQuickMessage = false;
        }
      });
    }
  }

  markMessageAsRead(messageId: number): void {
    // Simulate marking as read
    const message = this.recentMessages.find(m => m.id === messageId);
    if (message) {
      message.isRead = true;
      this.toastr.success('Message marqué comme lu');
    }
  }

  markAllNotificationsAsRead(): void {
    this.userNotifications.forEach(notification => {
      // Simulate marking as read
    });
    this.toastr.success('Toutes les notifications marquées comme lues');
  }

  deleteNotification(notificationId: number): void {
    this.userNotifications = this.userNotifications.filter(n => n.id !== notificationId);
    this.toastr.success('Notification supprimée');
  }

  getSenderName(message: Message): string {
    if (message.senderId === 1) {
      return 'Vous';
    }
    const sender = this.availableUsers.find(u => u.id === message.senderId);
    return sender ? `${sender.firstName} ${sender.lastName}` : 'Utilisateur';
  }

  get firstName() { return this.profileForm.get('firstName'); }
  get lastName() { return this.profileForm.get('lastName'); }
  get email() { return this.profileForm.get('email'); }
  get phone() { return this.profileForm.get('phone'); }

  get quickRecipientId() { return this.quickMessageForm.get('recipientId'); }
  get quickContent() { return this.quickMessageForm.get('content'); }
}
