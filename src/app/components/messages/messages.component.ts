import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { Conversation, Message } from '../../models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  isLoading = true;
  unreadCount = 0;

  constructor(
    private messageService: MessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadConversations();
    this.loadUnreadCount();
  }

  loadConversations(): void {
    this.messageService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error('Erreur lors du chargement des conversations');
        this.isLoading = false;
      }
    });
  }

  loadUnreadCount(): void {
    this.messageService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
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
        this.toastr.error('Erreur lors du chargement des messages');
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

  sendMessage(content: string): void {
    if (content.trim() && this.selectedConversation) {
      const message = {
        content: content.trim(),
        receiverId: this.selectedConversation.participant.id,
        announcementId: this.selectedConversation.announcement.id!
      };

      this.messageService.sendMessage(message).subscribe({
        next: () => {
          this.loadMessages(this.selectedConversation!.id, this.selectedConversation!.announcement.id!);
        },
        error: (error) => {
          this.toastr.error('Erreur lors de l\'envoi du message');
        }
      });
    }
  }
}
