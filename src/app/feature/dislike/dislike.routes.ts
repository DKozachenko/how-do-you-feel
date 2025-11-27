import { Routes } from '@angular/router';

export enum DISLIKE_PATHS {
  Index = 'dislike',
}

export const DISLIKE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dislike-page/dislike-page').then((m) => m.DislikePage),
  },
];
