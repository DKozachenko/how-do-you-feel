import { test, expect } from '@playwright/test';
// eslint-disable-next-line boundaries/no-unknown
import packageJson from '../../package.json';
import { INFO_PATHS } from '../../src/app/feature/info/info.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
import { InfoPageObject } from '../page-objects/info.po';

test.describe('Info Page', () => {
  test('Should display correct version of application', async ({ page }) => {
    await test.step('Go to "info" page', async () =>
      await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${INFO_PATHS.Index}`));

    const infoPageObject = new InfoPageObject(page);

    await expect(infoPageObject.versionTitle).toContainText(packageJson.version);
  });

  test('Should download json file on export data button click (PWA)', async ({ page }) => {
    await test.step('Go to "info" page', async () =>
      await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${INFO_PATHS.Index}`));

    const infoPageObject = new InfoPageObject(page);
    await expect(infoPageObject.exportDataButton).toBeVisible();

    const downloadPromise = page.waitForEvent('download');

    await test.step('Click on export data button', async () => await infoPageObject.exportDataButton.click());

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('how-do-you-feel.data.json');
  });
});
