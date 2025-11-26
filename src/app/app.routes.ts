import { Routes } from '@angular/router';
import { TabsLayoutComponent } from '@layout/tabs-layout/tabs-layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'main/emotion',
  },
  {
    path: 'main',
    component: TabsLayoutComponent,
    loadChildren: () => import('@layout/tabs-layout/tabs.routes').then((r) => r.TABS_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'emotion',
  },
];
