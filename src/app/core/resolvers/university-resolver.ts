import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UniversityService } from '../services/university-service';

export const universityResolver: ResolveFn<any> = (route, state) => {
  const universityService = inject(UniversityService);
  const id = route.params['id'];

  if (!id) {
    throw new Error('No ID provided in route!');
  }

  return universityService.getUniversity(id);
};
