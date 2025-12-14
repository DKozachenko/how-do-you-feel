import { test, expect } from '@playwright/test';
import { EMOTION_PATHS } from '../../src/app/feature/emotion/emotion.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
// eslint-disable-next-line boundaries/no-unknown
import { ADD_EMOTION_FIELD_ORDER } from '../model/add-emotion-field-order.constant';
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

      for (let i = 0; i < formControls.length; ++i) {
        const control = formControls[i];

        await expect(control).toHaveAttribute('formControlName', ADD_EMOTION_FIELD_ORDER[i]);
      }
    });

    test('Should have big comment textarea field', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      await test.step('Click on add emotion modal button', async () =>
        await emotionPageObject.openAddEmotionModalButton.click());

      await expect(emotionPageObject.addEmotionModalForm).toBeVisible();
      await expect(emotionPageObject.commentTextareaControl).toBeVisible();

      const box = await emotionPageObject.commentTextareaControl.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(350);
    });

    test('Should open modal with emotions description', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      await test.step('Click on add emotion modal button', async () =>
        await emotionPageObject.openAddEmotionModalButton.click());

      await test.step('Click on emotion hint button', async () => await emotionPageObject.emotionHintButton.click());

      await expect(emotionPageObject.emotionsHintModal).toBeVisible();
    });
  });
});
