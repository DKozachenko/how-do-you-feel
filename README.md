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
- CSS colors descriptions in modal
- Emotions hint in edit emotion modal
- Styles for word wrapping
- Count on "like" and "dislike" pages

### Changed

- Change order of form fields in add emotion modal
- `dateTime` field for edit emotion

#### [1.2.0] - 11.01.2026

### Added

- Error text for controls
- Wrap text in action card and action card
- Search for like and dislike pages
- Privacy for actions and emotions
- PWA support
- Unit tests
- E2E tests

#### [1.2.1] - 17.01.2026

### Added

- Toast after downloading file on Info page

### Changed

- Behavior of native scroll in [LongPressDirective](./src/app/core/gesture/long-press/long-press.directive.ts)

#### [1.3.0] - 10.04.2026

### Added

- White border in case of emotion has "black" color
- Sheet modal with color options for emotion with same name in storage
- Add setting for changing action order on "Like" / "Dislike" pages

### Changed

- Crop visible history items in card displaying and editing

#### [1.3.1] - 02.08.2026

### Added

- Applying existing color for emotion if it's the only color

 
