import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink } from '@angular/router';
import { ForgotPasswordRequest } from '../../../core/Interfaces/forgot-password-request';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,RouterLink,InputTextModule,ButtonModule,ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  router = inject(Router);
  fpForm = this.formBuilder.group({
    email:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]]
  });

  forgotPassword(){
    if (this.fpForm.invalid) {
      this.fpForm.markAllAsTouched();
      return;
    }
    const ForgotPasswordRequest : ForgotPasswordRequest = {
      email: this.fpForm.value.email!,
    }
    this.authService.forgotPassword(ForgotPasswordRequest).subscribe({
      next:(response) => {
        if(response.result){
        this.messageService.add({severity:'success', summary:'Success', detail: response.message});}
        else{
        this.messageService.add({severity:'error', summary:'Error', detail: response.message});}
      },
      error:(error) => {
        this.messageService.add({severity:'error', summary:'Error', detail: error.message});
      }
    })
}
}