import { Routes } from '@angular/router';

export const enum LIKES_PATHS {
  Index = 'likes',
}

export const LIKES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./likes-page/likes-page').then((m) => m.LikesPage),
  },
];
