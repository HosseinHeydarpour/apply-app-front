import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from '../services/user-service';

export const userResolver: ResolveFn<any> = (route, state) => {
  const userService = inject(UserService);

  // Return the Observable from your service
  // The router will wait for this to complete before showing the page
  return userService.getUser();
};
