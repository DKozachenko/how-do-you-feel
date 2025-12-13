import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await test.step('Go to "dashboard" page', async () => await page.goto('/'));

  await expect(page).toHaveURL('/main/emotion');
});
