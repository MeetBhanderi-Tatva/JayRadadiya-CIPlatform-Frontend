import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StrongPasswordRegx } from '../../../shared/password-regex';
import { matchValidator } from '../../../shared/confirm-password';
import { ChangePasswordRequest } from '../../../core/Interfaces/change-password-request';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  email: string | null = null;
  token: string | null = null;

  cpForm = this.formBuilder.group(
    {
      password: [
        '',
        [Validators.required, Validators.pattern(StrongPasswordRegx)],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: matchValidator('password', 'confirmPassword'),
    }
  );
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }
  changePassword() {
    if (this.cpForm.invalid) {
      this.cpForm.markAllAsTouched();
      return;
    }
    const ChangePassword: ChangePasswordRequest = {
      email: this.email!,
      token: this.token!,
      password: this.cpForm.value.password!,
      confirmPassword: this.cpForm.value.confirmPassword!,
    };
    this.authService.changePassword(ChangePassword).subscribe({
      next: (response) => {
        if (response.result) {
          this.router.navigateByUrl('/login');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message,
        });
      },
    });
  }
}
