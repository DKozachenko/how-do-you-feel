import { DISLIKES_PATHS } from '@feature/dislikes/dislikes.routes';
import { EMOTION_PATHS } from '@feature/emotion/emotion.routes';
import { JOURNAL_PATHS } from '@feature/journal/journal.routes';
import { LIKES_PATHS } from '@feature/likes/likes.routes';
import { SETTINGS_PATHS } from '@feature/settings/settings.routes';

export const enum TABS_LAYOUT_PATHS {
  Index = 'main',
}

export const TABS_ROUTES = [
  {
    path: EMOTION_PATHS.Index,
    loadChildren: () => import('@feature/emotion/emotion.routes').then((r) => r.EMOTION_ROUTES),
  },
  {
    path: JOURNAL_PATHS.Index,
    loadChildren: () => import('@feature/journal/journal.routes').then((r) => r.JOURNAL_ROUTES),
  },
  {
    path: SETTINGS_PATHS.Index,
    loadChildren: () => import('@feature/settings/settings.routes').then((r) => r.SETTINGS_ROUTES),
  },
  {
    path: LIKES_PATHS.Index,
    loadChildren: () => import('@feature/likes/likes.routes').then((r) => r.LIKES_ROUTES),
  },
  {
    path: DISLIKES_PATHS.Index,
    loadChildren: () => import('@feature/dislikes/dislikes.routes').then((r) => r.DISLIKES_ROUTES),
  },
];
