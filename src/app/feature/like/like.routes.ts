import { Routes } from '@angular/router';

export enum LIKE_PATHS {
  Index = 'like',
}

export const LIKE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./like-page/like-page').then((m) => m.LikePage),
  },
];
