/* eslint-disable boundaries/no-unknown-files */
import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

export const BASE_CONFIG: PlaywrightTestConfig = defineConfig({
  testDir: '../../e2e',
  testMatch: '*.spec.ts',
  outputDir: '../../e2e/test-output',
  timeout: 10000,
  use: {
    baseURL: 'http://localhost:4200',
    locale: 'ru-RU',
    timezoneId: 'Europe/Belgrade',
    video: 'off',
    headless: true,
    testIdAttribute: 'pw-automation-id',
  },
  expect: {
    timeout: 5000,
  },
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Galaxy S24'],
        viewport: {
          width: 360,
          height: 780,
        },
      },
    },
  ],
  webServer: {
    command: 'npm run web:start',
    timeout: 60000,
    // You need localhost
    // https://github.com/microsoft/playwright/issues/16834#issuecomment-1699124292
    url: 'http://localhost:4200',
  },
});
