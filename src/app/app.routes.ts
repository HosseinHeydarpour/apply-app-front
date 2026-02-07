import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { SignUp } from './features/auth/sign-up/sign-up';
import { Profile } from './features/profile/profile';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: SignUp,
  },
  {
    path: 'profile',
    component: Profile,
  },
];
