import { test, expect } from '@playwright/test';
import { EMOTION_PATHS } from '../../src/app/feature/emotion/emotion.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
import { EmotionPageObject } from '../page-objects/emotion.po';

test.describe('Emotion Page', () => {
  test.describe('Add Emotion Modal', () => {
    test('Should have correct field order in form (name, color, comment)', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      await test.step('Click on add emotion modal button', async () =>
        await emotionPageObject.openAddEmotionModalButton.click());

      await expect(emotionPageObject.addEmotionModalForm).toBeVisible();

      await expect(emotionPageObject.addEmotionModalFormControls).toHaveCount(3);

      const formControls = await emotionPageObject.addEmotionModalFormControls.all();

      const FORM_CONTROL_ORDER = ['name', 'color', 'comment'];

      formControls.forEach(async (control, index) => {
        await expect(control).toHaveAttribute('formControlName', FORM_CONTROL_ORDER[index]);
      });
    });
  });
});
