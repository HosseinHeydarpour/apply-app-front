import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';
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
}
