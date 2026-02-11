import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UniversityService {
  http = inject(HttpClient);
  apiURL = environment.apiUrl;

  getAllUniversities() {
    return this.http.get(`${this.apiURL}/universities`).pipe(
      map((res: any) => {
        return res.data.universities;
      }),
    );
  }

  getTopUnis() {
    return this.http.get(`${this.apiURL}/universities/top`).pipe(
      map((res: any) => {
        return res.data.universities;
      }),
    );
  }
}
