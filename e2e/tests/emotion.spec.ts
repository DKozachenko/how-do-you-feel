import { test, expect } from '@playwright/test';
import { Emotion } from '../../src/app/core/model/emotion.interface';
import { EMOTION_PATHS } from '../../src/app/feature/emotion/emotion.routes';
import { JOURNAL_PATHS } from '../../src/app/feature/journal/journal.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
// eslint-disable-next-line boundaries/no-unknown
import { ADD_EMOTION_FIELD_ORDER } from '../model/add-emotion-field-order.constant';
import { EmotionPageObject } from '../page-objects/emotion.po';
import { JournalPageObject } from '../page-objects/journal.po';

test.describe('Emotion Page', () => {
  test.describe('Add Emotion Modal', () => {
    test('Should have correct field order in form (name, color, comment, private)', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      await test.step('Click on add emotion modal button', async () =>
        await emotionPageObject.openAddEmotionModalButton.click());

      await expect(emotionPageObject.addEmotionModalForm).toBeVisible();

      await expect(emotionPageObject.addEmotionModalFormControls).toHaveCount(4);

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

    test('Should open modal with css colors description', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      await test.step('Click on add emotion modal button', async () =>
        await emotionPageObject.openAddEmotionModalButton.click());

      await test.step('Click on css colors hint button', async () =>
        await emotionPageObject.cssColorsHintButton.click());

      await expect(emotionPageObject.cssColorsHintModal).toBeVisible();
    });

    test('Should save NON-private emotion so that it is visible in journal', async ({ page }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      const testEmotion: Omit<Emotion, 'id' | 'dateTime'> = {
        name: 'Test Name',
        color: 'green',
        comment: 'Test Description',
        private: false,
      };

      await test.step('Create test emotion', async () => await emotionPageObject.createEmotion(testEmotion));

      await test.step('Go to "journal" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(page);

      await expect(journalPageObject.emotionCards).toHaveCount(1);

      const onlyEmotionCard = journalPageObject.emotionCards.first();
      const ionCard = onlyEmotionCard.locator('ion-card');
      const ionCardStyle = await ionCard.getAttribute('style');
      expect(ionCardStyle).toContain('filter: initial');
    });

    test('Should save private emotion so that it is NOT visible and its actions NOT clickable in journal', async ({
      page,
    }) => {
      await test.step('Go to "emotion" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

      const emotionPageObject = new EmotionPageObject(page);

      const testEmotion: Omit<Emotion, 'id' | 'dateTime'> = {
        name: 'Test Name',
        color: 'green',
        comment: 'Test Description',
        private: true,
      };

      await test.step('Create test emotion', async () => await emotionPageObject.createEmotion(testEmotion));

      await test.step('Go to "journal" page', async () =>
        await page.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(page);

      await expect(journalPageObject.emotionCards).toHaveCount(1);

      const onlyEmotionCard = journalPageObject.emotionCards.first();
      const ionCard = onlyEmotionCard.locator('ion-card');
      const ionCardStyle = await ionCard.getAttribute('style');
      expect(ionCardStyle).toContain('filter: blur');

      const editCardButton = onlyEmotionCard.getByTestId('open-edit-emotion-modal-button');
      await test.step('Click on edit button', async () => await editCardButton.click({ force: true }));
      await expect(editCardButton).toHaveAttribute('disabled');
      await expect(journalPageObject.editEmotionModalForm).not.toBeVisible();

      const removeCardButton = onlyEmotionCard.getByTestId('remove-emotion-button');
      await expect(removeCardButton).toHaveAttribute('disabled');
      await test.step('Click on remove button', async () => await removeCardButton.click({ force: true }));

      await expect(journalPageObject.emotionCards).toHaveCount(1);
    });
  });
});
