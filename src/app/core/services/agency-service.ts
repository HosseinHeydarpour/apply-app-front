import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AgencyService {
  httpClient = inject(HttpClient);

  getAgencies() {
    return this.httpClient.get(`${environment.apiUrl}/agencies`).pipe(
      map((res: any) => {
        return res.data.agencies;
      }),
    );
  }

  getAgency(id: string | number) {
    return this.httpClient.get(`${environment.apiUrl}/agencies/${id}`).pipe(
      map((res: any) => {
        return res.data.agency;
      }),
    );
  }

  requestConsultation(agencyId: string, scheduledAt?: Date | string): Observable<any> {
    // 1. Construct the body based on the controller requirements
    const body = {
      agencyId: agencyId,
    };

    // 2. Post to the correct endpoint
    return this.httpClient.post(`${environment.apiUrl}/users/consultation`, body).pipe(
      map((res: any) => {
        // 3. Return the specific data object (res.data.consultation based on controller)
        return res.data;
      }),
    );
  }

  getAdvertisedAgencies() {
    return this.httpClient.get(`${environment.apiUrl}/ads`).pipe(
      map((res: any) => {
        return res.data.ads;
      }),
    );
  }
}
