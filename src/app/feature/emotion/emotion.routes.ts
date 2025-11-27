import { Routes } from '@angular/router';

export const enum EMOTION_PATHS {
  Index = 'emotion',
}

export const EMOTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./emotion-page/emotion-page').then((m) => m.EmotionPage),
  },
];
