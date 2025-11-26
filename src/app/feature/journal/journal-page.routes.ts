import { Routes } from '@angular/router';

export const JOURNAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./journal-page/journal-page').then((m) => m.JournalPage),
  },
];
