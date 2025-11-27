import { Routes } from '@angular/router';

export enum SETTINGS_PATHS {
  Index = 'settings',
}

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings-page/settings-page').then((m) => m.SettingsPage),
  },
];
