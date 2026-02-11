import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private tokenKey = '';

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response) => {
        this.tokenKey = response.token;
        localStorage.setItem('token', response.token);
      }),
    );
  }

  logout() {
    this.tokenKey = '';
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    return true;
  }
}
