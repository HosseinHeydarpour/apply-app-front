import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Agency {
  httpClient = inject(HttpClient);

  getAgencies() {
    return this.httpClient.get(`${environment.apiUrl}/agencies`);
  }
}
