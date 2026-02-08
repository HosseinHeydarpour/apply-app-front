import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { SignUp } from './features/auth/sign-up/sign-up';
import { Profile } from './features/profile/profile';
import { Home } from './features/home/home';
import { Explore } from './features/explore/explore';
import { Agency } from './features/agency/agency';

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
    children: [
      {
        path: '',
        component: Profile,
      }, // Matches /profile
      {
        path: 'edit',
        loadComponent: () =>
          import('./features/profile/profile-actions/edit/edit').then((m) => m.Edit),
      }, // Matches /profile/edit
      {
        path: 'history',
        loadComponent: () =>
          import('./features/profile/profile-actions/history/history').then((m) => m.History),
      }, // Matches /profile/history
      {
        path: 'passport',
        loadComponent: () =>
          import('./features/profile/profile-actions/passport/passport').then((m) => m.Passport),
      }, // Matches /profile/passport
      {
        path: 'score-list',
        loadComponent: () =>
          import('./features/profile/profile-actions/score-list/score-list').then(
            (m) => m.ScoreList,
          ),
      }, // Matches /profile/score-list
      {
        path: 'other-docs',
        loadComponent: () =>
          import('./features/profile/profile-actions/other-docs/other-docs').then(
            (m) => m.OtherDocs,
          ),
      }, // Matches /profile/other-docs
    ],
  },
  {
    path: 'explore',
    component: Explore,
  },
  {
    path: 'agency',
    component: Agency,
  },
  {
    path: '',
    component: Home,
  },
];
