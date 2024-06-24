import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './features/auth/change-password/change-password.component';
import { HomeComponent } from './features/home/home/home.component';
import { LandingPageComponent } from './features/home/landing-page/landing-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    // {
    //     path: "",
    //     component: HomeComponent,
    // },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "register",
        component: RegisterComponent,
    },
    {
        path: "forgot-password",
        component: ForgotPasswordComponent,
    },
    {
        path: "changepassword",
        component: ChangePasswordComponent,
    },
    { path: '', component: HomeComponent, 
    children: [
      { path: '', component: LandingPageComponent }
    ],canActivate:[authGuard]
   },
];
