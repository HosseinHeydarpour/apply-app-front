import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = '';
  private router = inject(Router);

  login(credentials: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response) => {
        this.tokenKey = response.token;
        localStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    this.tokenKey = '';
    // 1. Clear the token
    localStorage.removeItem('token');
    // 2. Redirect the user
    this.router.navigate(['/']); // Redirect to Home
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  signUp(userData: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/signup`, userData).pipe(
      tap((response) => {
        // clear token before setting new one
        this.clearToken();

        // backend returns a token immediately after signup
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      }),
    );
  }

  setNewToken(token: string) {
    this.clearToken();
    this.tokenKey = token;
    localStorage.setItem('token', token);
  }
}
