import { ResolveFn } from '@angular/router';

import { inject } from '@angular/core';
import { UniversityService } from '../services/university-service';

export const exploreResolver: ResolveFn<any> = () => {
  const universityService = inject(UniversityService);

  return universityService.getAllUniversities();
};
