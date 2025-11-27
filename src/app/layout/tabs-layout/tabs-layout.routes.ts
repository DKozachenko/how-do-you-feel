import { DISLIKE_PATHS } from '@feature/dislike/dislike.routes';
import { EMOTION_PATHS } from '@feature/emotion/emotion.routes';
import { JOURNAL_PATHS } from '@feature/journal/journal.routes';
import { LIKE_PATHS } from '@feature/like/like.routes';
import { SETTINGS_PATHS } from '@feature/settings/settings.routes';

export const enum TABS_LAYOUT_PATHS {
  Index = 'main',
}

export const TABS_ROUTES = [
  {
    path: DISLIKE_PATHS.Index,
    loadChildren: () => import('@feature/dislike/dislike.routes').then((r) => r.DISLIKE_ROUTES),
  },
  {
    path: LIKE_PATHS.Index,
    loadChildren: () => import('@feature/like/like.routes').then((r) => r.LIKE_ROUTES),
  },
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
];
