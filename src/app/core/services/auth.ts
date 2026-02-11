import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
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

  public isAuthenticated = signal<boolean>(this.hasValidToken());

  login(credentials: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response) => {
        this.tokenKey = response.token;
        localStorage.setItem('token', response.token);
        // 3. Update the signal to TRUE on login
        this.isAuthenticated.set(true);
      }),
    );
  }

  logout() {
    this.tokenKey = '';
    // 1. Clear the token
    localStorage.removeItem('token');

    // Update signal here too
    this.isAuthenticated.set(false);

    // 2. Redirect the user
    this.router.navigate(['/']); // Redirect to Home
  }

  getToken() {
    return localStorage.getItem('token');
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
          // Update signal here too
          this.isAuthenticated.set(true);
        }
      }),
    );
  }

  setNewToken(token: string) {
    this.clearToken();
    this.tokenKey = token;
    localStorage.setItem('token', token);

    // ADD THIS: Update the signal so the UI knows we have a valid token
    this.isAuthenticated.set(true);
  }

  // Helper for initialization only
  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }
}
