/* eslint-disable boundaries/no-unknown-files */
import { PlaywrightTestConfig, defineConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'How do you feel:Report',
  preserveOutput: 'never',
  quiet: false,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reportSlowTests: {
    threshold: 5000,
    max: 5,
  },
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: '../../e2e/html-report' }],
    ['junit', { outputFile: '../../e2e/report/test-results-e2e.xml' }],
  ],
  use: {
    ...BASE_CONFIG.use,
    trace: 'retain-on-failure',
    screenshot: 'off',
  },
  webServer: <PlaywrightTestConfig['webServer']>{
    ...BASE_CONFIG.webServer,
    reuseExistingServer: false,
  },
});
