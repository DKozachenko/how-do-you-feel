import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'emotion',
  },
  {
    path: 'emotion',
    loadChildren: () => import('./feature/emotion/emotion-page.routes').then((r) => r.EMOTION_ROUTES),
  },
];
