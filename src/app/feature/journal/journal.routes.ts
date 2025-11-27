import { Routes } from '@angular/router';

export const enum JOURNAL_PATHS {
  Index = 'journal',
}

export const JOURNAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./journal-page/journal-page').then((m) => m.JournalPage),
  },
];
