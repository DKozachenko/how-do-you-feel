# HowDoFeel

Application for tracking personal state of person: feelings, emotions, thing that he likes to do and that he doesn't.

*Whole UI is written in Russian.*

### Run as SPA in browser

```bash
npm ci
npm run web:start
```

### Build apk

```bash
npm ci
npm run web:build
npm run android:sync
```

Open [`Android Studio`](https://developer.android.com/studio), choose:
- `Build` -> `Create App Bundles or APKs` -> `Generate APKs`.

### CHANGELOG

#### [1.0.0] - 04.12.2025

### Added

- **Emotion** page with button for addition of emotion
- **Journal** page with list of emotions grouped by date
- **Like** page with things that user likes to do
- **Dislike** page with things that user doesn't like to do
- **Info** page with version from [`package.json`](./package.json)

#### [1.1.0] - 14.12.2025

### Added

- E2E Tests with [Playwright](https://playwright.dev/)
- Unit Tests with [Jest](https://jestjs.io/)
- `min-height` for all textarea's

### Changed

- Change order of form fields in add emotion modal
- `dateTime` field for edit emotion
