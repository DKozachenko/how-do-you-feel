/* eslint-disable boundaries/no-unknown-files */
import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'How do you feel:Local',
  preserveOutput: 'always',
  quiet: false,
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: undefined,
  reportSlowTests: null,
  reporter: [['line']],
  use: {
    ...BASE_CONFIG.use,
    trace: 'on',
    screenshot: 'only-on-failure',
  },
  webServer: <PlaywrightTestConfig['webServer']>{
    ...BASE_CONFIG.webServer,
    reuseExistingServer: true,
  },
});
