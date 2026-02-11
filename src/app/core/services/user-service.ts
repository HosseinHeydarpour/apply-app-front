import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  apiURL = environment.apiUrl;
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No JWT token found in localStorage.');
      return of(null); // Return an observable with null if no token
    }

    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const userId = decoded.id;

      if (!userId) {
        console.error('User ID not found in token payload.');
        return of(null);
      }

      return this.http.get(`${this.apiURL}/users/${userId}`).pipe(
        map((res: any) => {
          return res.data.user;
        }),
      );
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return of(null);
    }
  }

  changePassword(data: any): Observable<any> {
    return this.http.patch(`${this.apiURL}/users/updateMyPassword`, data);
  }
}
