# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HowDoFeel is an Angular + Ionic mobile application for tracking personal emotional state, feelings, and activities (likes/dislikes). The application is built as a hybrid app that can run as an SPA in the browser or as a native Android APK. The entire UI is written in Russian.

## Technology Stack

- **Frontend**: Angular 21 (standalone components with OnPush change detection)
- **Mobile Framework**: Ionic Angular 8 + Capacitor 7
- **State Management**: RxJS with local storage via `@ionic/storage-angular`
- **Testing**: Jest (unit tests), Playwright (E2E tests)
- **Linting**: ESLint (with custom configs), Stylelint
- **Build**: Angular CLI with custom configurations

## Common Commands

### Development
```bash
# Start development server (SPA mode)
npm run web:start

# Build web application
npm run web:build

# Sync web build with Android platform
npm run android:sync
```

### Testing
```bash
# Run unit tests locally
npm run test:unit:local

# Run unit tests for CI
npm run test:unit:ci

# Generate unit test coverage report
npm run test:unit:coverage

# Generate unit test results report
npm run test:unit:report

# Run E2E tests locally with Playwright UI
npm run test:e2e:pw:local

# Run E2E tests for CI
npm run test:e2e:pw:ci

# Generate E2E test report
npm run test:e2e:pw:report
```

### Linting
```bash
# Run ESLint
npm run lint

# Run Stylelint
npm run stylelint

# Run lint-staged (for pre-commit hook)
npm run lint-staged
```

### Analysis
```bash
# Analyze bundle size (runs preanalyze, analyze, and postanalyze)
npm run analyze:bundle

# Analyze dependency graph (requires Graphviz)
npm run analyze:deps
```

### Android Build
```bash
# After building web and syncing, open Android Studio to generate APK:
# Build -> Create App Bundles or APKs -> Generate APKs
```

### Utilities
```bash
# Generate Android app icon from logo in public/logo
npm run android:generate:app:icon
```

## Architecture

### Directory Structure

The application follows a feature-based architecture with clear separation of concerns:

```
src/app/
├── core/          # Core services, models, and shared utilities
├── feature/       # Feature modules (emotion, journal, like, dislike, info)
├── layout/        # Layout components (tabs-layout, main-layout)
├── pattern/       # Reusable patterns/components used across features
└── ui/            # UI components (pulse-button, etc.)
```

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:
- `@core/*` → `./src/app/core/*`
- `@layout/*` → `./src/app/layout/*`
- `@feature/*` → `./src/app/feature/*`
- `@pattern/*` → `./src/app/pattern/*`
- `@ui/*` → `./src/app/ui/*`

Always use these aliases for imports instead of relative paths.

### Storage Pattern

The application uses a base storage service pattern for data persistence:

- `IonicStorageService` wraps `@ionic/storage-angular` for key-value storage
- `BaseStorageService<T>` is an abstract class providing CRUD operations for entities
- Feature-specific storage services extend `BaseStorageService`:
  - `EmotionsStorage` (emotions data)
  - `LikesStorage` (things user likes)
  - `DislikesStorage` (things user doesn't like)

All entities extend `BaseEntity` interface with an `id` property. IDs are generated using `uuid` v4.

### Routing Architecture

- Root routes defined in `src/app/app.routes.ts`
- Default route redirects to `main/emotion` (tabs layout with emotion page)
- `TabsLayoutComponent` uses lazy-loaded child routes for features:
  - `emotion` - Add new emotions
  - `journal` - View emotion history grouped by date
  - `like` - Track things user likes
  - `dislike` - Track things user doesn't like
  - `info` - App version information

### Component Patterns

- All components use Angular standalone APIs
- Default change detection strategy: `OnPush`
- Default style: SCSS
- Components typically named with `.ts` extension (not `.component.ts`)

### Testing

- **Unit Tests**: Located alongside source files with `.spec.ts` extension
- **E2E Tests**: Located in `e2e/tests/` directory
- Multiple Jest configurations for different environments (local, CI, coverage, report) in `configs/jest/`
- Multiple Playwright configurations (local, CI, report) in `configs/playwright/`

### Linting and Code Quality

- ESLint configurations split by concern in `configs/eslint/`:
  - Angular-specific rules
  - TypeScript rules
  - Import rules (including boundaries plugin)
  - Prettier integration
- Stylelint configuration in `configs/stylelint/`
- Commitizen configured for conventional commits with custom config in `configs/commitizen/`
- Husky configured for pre-commit hooks with lint-staged

### CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/pipeline.yml`) includes:
- Dependency caching
- Parallel execution of linting, testing, and analysis
- Unit test coverage and reporting
- E2E test execution with Playwright
- Web build and Android APK generation
- Automatic release creation when pushing to `develop` branch
- APK signing with keystore from GitHub secrets

### Bundle Size Limits

Production build budgets (in `angular.json`):
- Initial bundle: warning at 1.5MB, error at 2MB
- Component styles: warning at 4kB, error at 8kB

## Development Notes

- When adding new validators, follow the pattern in `src/app/core/validators/` (separate files with `.spec.ts` tests)
- Date formatting uses `date-fns` with the main format constant in `src/app/core/model/main-date-format.constant.ts`
- Modal components should use `ModalRole` enum from `@core/model/modal-role.enum`
- All configuration files are in `configs/` directory for better organization
