import { Routes } from '@angular/router';

export const enum DISLIKES_PATHS {
  Index = 'dislikes',
}

export const DISLIKES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dislikes-page/dislikes-page').then((m) => m.DislikesPage),
  },
];
