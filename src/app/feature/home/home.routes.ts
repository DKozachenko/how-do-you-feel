import { Routes } from '@angular/router';

// import { config } from '../../app.config';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./home-page/home').then((m) => m.HomePage),
  },
];
