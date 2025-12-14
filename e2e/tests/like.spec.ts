import { test, expect } from '@playwright/test';
import { LIKE_PATHS } from '../../src/app/feature/like/like.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
import { LikePageObject } from '../page-objects/like.po';

test.describe('Like Page', () => {
  test.describe('Add Action Modal', () => {
    test('Should have big comment textarea field', async ({ page }) => {
      await test.step('Go to "like" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

      const likePageObject = new LikePageObject(page);

      await test.step('Click on add action modal button', async () =>
        await likePageObject.openAddActionModalButton.click());

      await expect(likePageObject.addActionModalForm).toBeVisible();
      expect(likePageObject.commentTextareaControl).toBeVisible();

      const box = await likePageObject.commentTextareaControl.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(350);
    });
  });
});
