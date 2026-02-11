import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgencyService } from '../services/agency-service';
import { UniversityService } from '../services/university-service';

export const homeResolver: ResolveFn<{ universities: any; agencies: any }> = (route, state) => {
  const universityService = inject(UniversityService);
  const agencyService = inject(AgencyService);

  // Use forkJoin to wait for both observables to complete
  return forkJoin({
    universities: universityService.getTopUnis(),
    agencies: agencyService.getAgencies(),
    ads: agencyService.getAdvertisedAgencies(),
  });
};
