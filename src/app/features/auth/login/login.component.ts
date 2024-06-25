import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StrongPasswordRegx } from '../../../shared/password-regex';
import { LoginRequest } from '../../../core/Interfaces/login-request';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ FormsModule,ReactiveFormsModule,RouterLink,InputTextModule,PasswordModule,ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  
})
export class LoginComponent {

  authService = inject(AuthService);
  messageService = inject(MessageService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  hide = true;
  loginForm = this.formBuilder.group({
    email:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    password:['',[Validators.required, Validators.pattern(StrongPasswordRegx)]],
  });

  login(){
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const LoginRequest : LoginRequest = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!
    }
    this.authService.login(LoginRequest).subscribe({
      next:(response) => {
        if(response.result){
          this.router.navigateByUrl('/');
        this.messageService.add({severity:'success', summary:'Success', detail: response.message});}
        else{
        this.messageService.add({severity:'error', summary:'Error', detail: response.message});}
      },
      error:(error) => {
        this.messageService.add({severity:'error', summary:'Error', detail: error.message});
      }
    })
}}
