import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';
import { Observable } from 'rxjs';

// Ensure the return type matches what your service returns (e.g., Observable<any[]>)
export const historyResolver: ResolveFn<any[]> = (route, state) => {
  const userService = inject(UserService);

  // CRITICAL: You must RETURN the observable here.
  // The router will subscribe, wait for the data, and then proceed.
  return userService.getUserHistory();
};
