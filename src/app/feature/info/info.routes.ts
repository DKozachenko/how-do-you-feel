import { Routes } from '@angular/router';

export enum INFO_PATHS {
  Index = 'info',
}

export const INFO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./info-page/info-page').then((m) => m.InfoPage),
  },
];
