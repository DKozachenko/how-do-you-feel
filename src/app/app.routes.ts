import { Routes } from '@angular/router';
import { EMOTION_PATHS } from '@feature/emotion/emotion.routes';
import { TabsLayoutComponent } from '@layout/tabs-layout/tabs-layout';
import { TABS_LAYOUT_PATHS } from '@layout/tabs-layout/tabs-layout.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: `${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`,
  },
  {
    path: TABS_LAYOUT_PATHS.Index,
    component: TabsLayoutComponent,
    loadChildren: () => import('@layout/tabs-layout/tabs-layout.routes').then((r) => r.TABS_ROUTES),
  },
  {
    path: '**',
    redirectTo: `${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`,
  },
];
