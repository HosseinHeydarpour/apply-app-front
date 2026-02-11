import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { AgencyService } from '../services/agency-service';
import { Observable } from 'rxjs';

export const agencyResolver: ResolveFn<any> = (route, state) => {
  const id = route.paramMap.get('id'); // get 'id' from route
  const agencyService = inject(AgencyService); // inject your service

  if (!id) {
    throw new Error('No ID provided in route!');
  }

  // return observable from your service
  return agencyService.getAgency(id);
};
