import { Routes } from '@angular/router';
// TODO: переименовать файл
export const EMOTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./emotion-page/emotion-page').then((m) => m.EmotionPage),
  },
];
