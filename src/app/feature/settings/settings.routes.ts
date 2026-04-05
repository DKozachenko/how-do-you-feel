import { Routes } from '@angular/router';

export enum SETTINGS_PATHS {
  Index = 'info',
}

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings-page/settings-page').then((m) => m.SettingsPage),
  },
];
