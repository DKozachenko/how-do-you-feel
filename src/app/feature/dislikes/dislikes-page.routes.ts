import { Routes } from '@angular/router';

export const DISLIKES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dislikes-page/dislikes-page').then((m) => m.DislikesPage),
  },
];
