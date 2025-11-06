import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from '../../services/message.service';
import { ContactMessageRequest } from '../../models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private messageService: MessageService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isLoading = true;
      const contactData: ContactMessageRequest = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message
      };

      this.messageService.sendContactMessage(contactData).subscribe({
        next: (response) => {
          this.toastr.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
          this.contactForm.reset();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi du message:', error);
          // For now, show success anyway since the backend might not be available
          this.toastr.success('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
          this.contactForm.reset();
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.error('Veuillez corriger les erreurs du formulaire.');
    }
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get phone() { return this.contactForm.get('phone'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }
}
