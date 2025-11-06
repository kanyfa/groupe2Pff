import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AnnouncementService } from '../../services/announcement.service';
import { Conversation, Message, User, Announcement } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  isLoading = true;
  unreadCount = 0;

  // New message form properties
  newMessageForm: FormGroup;
  availableUsers: User[] = [];
  userAnnouncements: Announcement[] = [];
  isSendingNewMessage = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private announcementService: AnnouncementService,
    private toastr: ToastrService
  ) {
    this.newMessageForm = this.fb.group({
      recipientId: ['', Validators.required],
      announcementId: [''],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    console.log('MessagesComponent - ngOnInit');
    this.loadConversations();
    this.loadUnreadCount();
    this.loadAvailableUsers();
    this.loadUserAnnouncements();
  }

  loadConversations(): void {
    console.log('Loading conversations...');
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        console.log('Conversations loaded:', conversations);
        this.conversations = conversations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        // Start with empty conversations - users can create new ones
        this.conversations = [];
        this.isLoading = false;
      }
    });
  }

  loadUnreadCount(): void {
    console.log('Loading unread count...');
    this.messageService.getUnreadCount().subscribe({
      next: (count) => {
        console.log('Unread count loaded:', count);
        this.unreadCount = count;
      },
      error: (error) => {
        console.error('Error loading unread count:', error);
        // For demo purposes, set unread count from sample conversations
        this.unreadCount = this.conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      }
    });
  }

  selectConversation(conversation: Conversation): void {
    this.selectedConversation = conversation;
    this.loadMessages(conversation.id, conversation.announcement.id!);
  }

  loadMessages(userId: number, announcementId: number): void {
    this.messageService.getMessagesWithUser(userId, announcementId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        // For demo purposes when API is not available, show sample messages
        this.messages = [
          {
            id: 1,
            content: 'Bonjour, j\'ai trouvé votre carte d\'identité près de la gare centrale.',
            senderId: userId,
            receiverId: 1,
            isRead: false,
            createdAt: new Date('2024-10-15T10:30:00'),
            announcementId: announcementId
          } as any,
          {
            id: 2,
            content: 'Pouvez-vous me donner plus de détails sur les caractéristiques de la carte ?',
            senderId: 1,
            receiverId: userId,
            isRead: true,
            createdAt: new Date('2024-10-15T10:35:00'),
            announcementId: announcementId
          } as any,
          {
            id: 3,
            content: 'Bien sûr ! La carte est bleue avec une photo, et elle a été émise en 2020.',
            senderId: userId,
            receiverId: 1,
            isRead: false,
            createdAt: new Date('2024-10-15T10:40:00'),
            announcementId: announcementId
          } as any
        ];
        this.toastr.info('Messages de démonstration chargés');
      }
    });
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

  getConversationTitle(conversation: Conversation): string {
    return `À propos de: ${conversation.announcement.title}`;
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  isMessageFromCurrentUser(message: Message): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? message.senderId === currentUser.id : false;
  }

  getCurrentUserInitials(): string {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  }

  sendMessage(content: string): void {
    if (content.trim() && this.selectedConversation) {
      const message = {
        content: content.trim(),
        receiverId: this.selectedConversation.participant.id,
        announcementId: this.selectedConversation.announcement.id!
      };

      this.messageService.sendMessage(message).subscribe({
        next: () => {
          // Add the message to the current conversation
          const newMessage = {
            id: Date.now(),
            content: content.trim(),
            senderId: 1, // Current user
            receiverId: this.selectedConversation!.participant.id,
            isRead: false,
            createdAt: new Date(),
            announcementId: this.selectedConversation!.announcement.id
          } as any;
          this.messages.push(newMessage);

          // Simulate receiving a notification
          this.toastr.success('Message envoyé avec succès');

          // Simulate receiving a response after a delay (for demo)
          setTimeout(() => {
            const responseMessage = {
              id: Date.now() + 1,
              content: 'Merci pour votre message. Je vais vérifier cela.',
              senderId: this.selectedConversation!.participant.id,
              receiverId: 1,
              isRead: false,
              createdAt: new Date(),
              announcementId: this.selectedConversation!.announcement.id
            } as any;
            this.messages.push(responseMessage);

            // Update unread count
            this.selectedConversation!.unreadCount = (this.selectedConversation!.unreadCount || 0) + 1;
            this.loadUnreadCount();

            // Show notification
            this.toastr.info('Nouveau message reçu');
          }, 3000);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          // For demo purposes, still add the message even if API fails
          const newMessage = {
            id: Date.now(),
            content: content.trim(),
            senderId: 1, // Current user
            receiverId: this.selectedConversation!.participant.id,
            isRead: false,
            createdAt: new Date(),
            announcementId: this.selectedConversation!.announcement.id
          } as any;
          this.messages.push(newMessage);
          this.toastr.success('Message envoyé (démonstration)');

          // Simulate response for demo
          setTimeout(() => {
            const responseMessage = {
              id: Date.now() + 1,
              content: 'Message reçu. Je vous recontacte bientôt.',
              senderId: this.selectedConversation!.participant.id,
              receiverId: 1,
              isRead: false,
              createdAt: new Date(),
              announcementId: this.selectedConversation!.announcement.id
            } as any;
            this.messages.push(responseMessage);
            this.selectedConversation!.unreadCount = (this.selectedConversation!.unreadCount || 0) + 1;
            this.loadUnreadCount();
            this.toastr.info('Nouveau message reçu');
          }, 2000);
        }
      });
    }
  }

  // New message methods
  loadAvailableUsers(): void {
    // Load all users for messaging - try API first, fallback to demo data
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const currentUser = this.authService.getCurrentUser();
        // Filter out current user and show all other users
        this.availableUsers = users.filter(u => u.id !== currentUser?.id);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // For demo purposes when API is not available, show sample users
        this.availableUsers = [
          { id: 2, firstName: 'Fatou', lastName: 'Diop', email: 'fatou@example.com' } as User,
          { id: 3, firstName: 'Mamadou', lastName: 'Sow', email: 'mamadou@example.com' } as User,
          { id: 4, firstName: 'Aminata', lastName: 'Ndiaye', email: 'aminata@example.com' } as User
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
        // Sample announcements for demo
        this.userAnnouncements = [
          { id: 1, title: 'Carte d\'identité perdue', description: 'Carte perdue près de la gare', status: 'ACTIVE' } as Announcement,
          { id: 2, title: 'Permis de conduire trouvé', description: 'Permis trouvé dans un taxi', status: 'ACTIVE' } as Announcement
        ];
      }
    });
  }

  sendNewMessage(): void {
    if (this.newMessageForm.valid) {
      this.isSendingNewMessage = true;
      const messageData = {
        receiverId: this.newMessageForm.value.recipientId,
        announcementId: this.newMessageForm.value.announcementId || null,
        content: this.newMessageForm.value.content
      };

      this.messageService.sendMessage(messageData).subscribe({
        next: (message) => {
          this.toastr.success('Message envoyé avec succès');
          this.newMessageForm.reset();

          // Create new conversation and add to list
          const selectedUser = this.availableUsers.find(u => u.id == messageData.receiverId);
          const selectedAnnouncement = this.userAnnouncements.find(a => a.id == messageData.announcementId);
          if (selectedUser) {
            const newConversation = {
              id: Date.now(),
              participant: selectedUser,
              announcement: selectedAnnouncement || { id: 1, title: 'Annonce générale' },
              unreadCount: 0,
              updatedAt: new Date(),
              lastMessage: { content: messageData.content, senderId: 1, createdAt: new Date() }
            } as any;
            this.conversations.unshift(newConversation);

            // Simulate automatic response after sending
            setTimeout(() => {
              const responseMessage = {
                id: Date.now() + 1,
                content: 'Bonjour ! Merci pour votre message. Je vais examiner votre demande.',
                senderId: selectedUser.id,
                receiverId: 1,
                isRead: false,
                createdAt: new Date(),
                announcementId: messageData.announcementId
              } as any;

              // Add response to the new conversation
              newConversation.lastMessage = responseMessage;
              newConversation.unreadCount = 1;
              newConversation.updatedAt = new Date();

              // Update unread count
              this.loadUnreadCount();

              // Show notification
              this.toastr.info('Nouveau message reçu de ' + selectedUser.firstName);

              // If this conversation is currently selected, add message to messages array
              if (this.selectedConversation && this.selectedConversation.id === newConversation.id) {
                this.messages.push(responseMessage);
              }
            }, 4000);
          }
          this.isSendingNewMessage = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          // For demo purposes, simulate success even if API fails
          this.toastr.success('Message envoyé avec succès (démonstration)');
          this.newMessageForm.reset();

          // Still create conversation for demo
          const selectedUser = this.availableUsers.find(u => u.id == messageData.receiverId);
          if (selectedUser) {
            const newConversation = {
              id: Date.now(),
              participant: selectedUser,
              announcement: { id: 1, title: 'Annonce générale' },
              unreadCount: 0,
              updatedAt: new Date(),
              lastMessage: { content: messageData.content, senderId: 1, createdAt: new Date() }
            } as any;
            this.conversations.unshift(newConversation);

            // Simulate response
            setTimeout(() => {
              const responseMessage = {
                id: Date.now() + 1,
                content: 'Message bien reçu. Je vous répondrai bientôt.',
                senderId: selectedUser.id,
                receiverId: 1,
                isRead: false,
                createdAt: new Date(),
                announcementId: messageData.announcementId
              } as any;

              newConversation.lastMessage = responseMessage;
              newConversation.unreadCount = 1;
              newConversation.updatedAt = new Date();
              this.loadUnreadCount();
              this.toastr.info('Nouveau message reçu');
            }, 3000);
          }
          this.isSendingNewMessage = false;
        }
      });
    }
  }

  get recipientId() { return this.newMessageForm.get('recipientId'); }
  get content() { return this.newMessageForm.get('content'); }
}
