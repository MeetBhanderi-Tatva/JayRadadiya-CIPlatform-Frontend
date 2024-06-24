import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import {  FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StrongPasswordRegx } from '../../../shared/password-regex';
import { RegisterRequest } from '../../../core/Interfaces/register-request';
import { matchValidator } from '../../../shared/confirm-password';
import { AlphabetOnlyDirective } from '../../../shared/alphabet-only.directive';
import { NumberOnlyDirective } from '../../../shared/number-only.directive';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,RouterLink,AlphabetOnlyDirective,NumberOnlyDirective,InputTextModule,PasswordModule,ButtonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  constructor(
    private authService:AuthService
  ){

  }
  //authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  router = inject(Router);

  registerForm = this.formBuilder.group({
    firstName:[''],
    lastName:[''],
    phoneNumber:['',[Validators.required,Validators.pattern("^[0-9]{10}$")]],
    email:['',[Validators.required,Validators.pattern("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")]],
    password:['',[Validators.required, Validators.pattern(StrongPasswordRegx)]],
    confirmPassword:['',[Validators.required]],
  },
      {
        validators: matchValidator('password', 'confirmPassword')
      }
);
blockNumbersOnInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/[0-9]/g, '');
  // Manually trigger change detection to update the form control value
  this.registerForm.get('firstName')?.setValue(input.value);
}
  register(){
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const RegisterRequest : RegisterRequest = {
      // id: this.route.snapshot.params['id'],
      firstName: this.registerForm.value.firstName!,
      lastName: this.registerForm.value.lastName!,
      email: this.registerForm.value.email!,
      phoneNumber: this.registerForm.value.phoneNumber!,
      password: this.registerForm.value.password!,
      confirmPassword: this.registerForm.value.confirmPassword!
    }
    this.authService.register(RegisterRequest).subscribe({
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
