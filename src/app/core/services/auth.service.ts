import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../Interfaces/login-request';
import { AuthResponse } from '../Interfaces/auth-response';
import { RegisterRequest } from '../Interfaces/register-request';
import { ForgotPasswordRequest } from '../Interfaces/forgot-password-request';
import { ChangePasswordRequest } from '../Interfaces/change-password-request';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';
  constructor(private http: HttpClient) {

  }

  login(data: LoginRequest): Observable<AuthResponse<string>> {
    return this.http
      .post<AuthResponse<string>>(`${this.apiUrl}/api/User/login`, data)
      .pipe(
        map((response) => {
          if (response.result) {
            localStorage.setItem(this.tokenKey, response.data);
          }
          return response;
        })
      );
  }
  register(data: RegisterRequest): Observable<AuthResponse<string>> {
    return this.http.post<AuthResponse<string>>(
      `${this.apiUrl}/api/User/register`,
      data
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<AuthResponse<string>> {
    return this.http.post<AuthResponse<string>>(
      `${this.apiUrl}/api/User/forgot-password`,
      data
    );
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse<string>> {
    return this.http.post<AuthResponse<string>>(
      `${this.apiUrl}/api/User/change-password`,
      data
    );
  }
  isLoggedIn = (): boolean => {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired();
  };
  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }
  logout = (): void => {
    localStorage.removeItem(this.tokenKey);
  };
  getToken = (): string | null => localStorage.getItem(this.tokenKey) || '';

  //   getUserDetail =()=> {
  //     const token = this.getToken();
  //     if(!token) return true;
  //     const decodedToken: any = jwtDecode(token);
  //     const userId = decodedToken.UserId;
  //     const email = decodedToken.Email;
  //     console.log(decodedToken);
  //     console.log(userId);
  //     console.log(email);
  //     return userId;

  //   }
}
