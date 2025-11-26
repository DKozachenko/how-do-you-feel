// TODO: мб вынести пути
export const TABS_ROUTES = [
  {
    path: 'emotion',
    loadChildren: () => import('@feature/emotion/emotion-page.routes').then((r) => r.EMOTION_ROUTES),
  },
  {
    path: 'journal',
    loadChildren: () => import('@feature/journal/journal-page.routes').then((r) => r.JOURNAL_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () => import('@feature/settings/settings-page.routes').then((r) => r.SETTINGS_ROUTES),
  },
  {
    path: 'likes',
    loadChildren: () => import('@feature/likes/likes-page.routes').then((r) => r.LIKES_ROUTES),
  },
  {
    path: 'dislikes',
    loadChildren: () => import('@feature/dislikes/dislikes-page.routes').then((r) => r.DISLIKES_ROUTES),
  },
];
