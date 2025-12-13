/* eslint-disable boundaries/no-unknown-files */
import { PlaywrightTestConfig, defineConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'How do you feel:CI',
  preserveOutput: 'failures-only',
  quiet: true,
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  reportSlowTests: {
    threshold: 5000,
    max: 5,
  },
  reporter: [['github'], ['dot']],
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
