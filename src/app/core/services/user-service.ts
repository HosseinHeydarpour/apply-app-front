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

  getUserHistory(): Observable<any[]> {
    return this.http.get(`${this.apiURL}/users/history`).pipe(
      map((res: any) => {
        const data = res.data;

        // 1. Map Applications
        // We look at 'university.name' and 'appliedAt'
        const appList = (data.applications || []).map((item: any) => ({
          id: item._id,
          type: 'application', // Type identifier
          typeLabel: 'پذیرش تحصیلی', // Persian Label for UI
          name: item.university?.name || 'نامشخص',
          date: item.appliedAt,
          status: item.status,
          logo: item.university?.logoUrl, // Optional: helpful for UI
        }));

        // 2. Map Consultations
        // We look at 'consultant.name' and 'scheduledAt'
        const consultList = (data.consultations || []).map((item: any) => ({
          id: item._id,
          type: 'consultation', // Type identifier
          typeLabel: 'رزرو مشاوره', // Persian Label for UI
          name: item.consultant?.name || 'نامشخص',
          date: item.scheduledAt,
          status: item.status,
          logo: item.consultant?.logoUrl, // Optional: helpful for UI
        }));

        // 3. Merge both arrays
        const combinedHistory = [...appList, ...consultList];

        // 4. Sort by Date (Newest first)
        return combinedHistory.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      }),
    );
  }
}
