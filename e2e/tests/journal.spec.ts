import { test, expect, Page } from '@playwright/test';
import { Emotion } from '../../src/app/core/model/emotion.interface';
import { EMOTION_PATHS } from '../../src/app/feature/emotion/emotion.routes';
import { JOURNAL_PATHS } from '../../src/app/feature/journal/journal.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
// eslint-disable-next-line boundaries/no-unknown
import { ADD_EMOTION_FIELD_ORDER } from '../model/add-emotion-field-order.constant';
import { EmotionPageObject } from '../page-objects/emotion.po';
import { JournalPageObject } from '../page-objects/journal.po';

let sharedPage: Page;

test.describe('Journal Page', () => {
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();

    await test.step('Go to "emotion" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

    const emotionPageObject = new EmotionPageObject(sharedPage);

    await test.step('Click on add emotion modal button', async () =>
      await emotionPageObject.openAddEmotionModalButton.click());

    const formControls = await emotionPageObject.addEmotionModalFormControls.all();

    const testEmotion: Omit<Emotion, 'id' | 'dateTime'> = {
      name: 'Test Name',
      color: 'green',
      comment: 'Test Description',
    };

    for (let i = 0; i < formControls.length; ++i) {
      const control = formControls[i];

      const controlName = <keyof Omit<Emotion, 'id' | 'dateTime'>>await control.getAttribute('formControlName') ?? '';
      const controlValue = testEmotion[controlName] ?? '';

      await test.step(`Fill control ${controlName} with value ${controlValue}`, async () => {
        const nativeInput = control.locator('input, textarea').first();
        await nativeInput.fill(controlValue);
        await expect(nativeInput).toHaveValue(controlValue);
      });
    }

    await test.step('Save test emotion', async () => await emotionPageObject.emotionModalSaveButton.click());
  });

  test.afterAll(async () => {
    await test.step('Go to "journal" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

    const journalPageObject = new JournalPageObject(sharedPage);

    const emotionCards = await journalPageObject.emotionCards.all();

    for (let i = 0; i < emotionCards.length; ++i) {
      const card = emotionCards[i];

      const removeCardButton = card.getByTestId('remove-emotion-button');
      await test.step(`Remove tests emotion with index ${i}`, async () => await removeCardButton.click());
    }

    await sharedPage.close();
  });

  test.describe('Edit Emotion Modal', () => {
    test('Should have correct field order in form (name, color, comment, dateTime)', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on edit emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.click());

      await expect(journalPageObject.editEmotionModalForm).toBeVisible();

      await expect(journalPageObject.editEmotionModalFormControls).toHaveCount(4);

      const formControls = await journalPageObject.editEmotionModalFormControls.all();

      const EDIT_EMOTION_FIELD_ORDER = [...ADD_EMOTION_FIELD_ORDER, 'dateTime'];

      for (let i = 0; i < formControls.length; ++i) {
        const control = formControls[i];

        await expect(control).toHaveAttribute('formControlName', EDIT_EMOTION_FIELD_ORDER[i]);
      }
    });

    test('Should have big comment textarea field', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on edit emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.click());

      await expect(journalPageObject.editEmotionModalForm).toBeVisible();

      expect(journalPageObject.commentTextareaControl).toBeVisible();

      const box = await journalPageObject.commentTextareaControl.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThan(350);
    });

    test('Should open modal with emotions description', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on add emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.click());

      await test.step('Click on emotion hint button', async () => await journalPageObject.emotionHintButton.click());

      await expect(journalPageObject.emotionsHintModal).toBeVisible();
    });

    test('Should open modal with css colors description', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on add emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.click());

      await test.step('Click on css colors hint button', async () =>
        await journalPageObject.cssColorsHintButton.click());

      await expect(journalPageObject.cssColorsHintModal).toBeVisible();
    });
  });
});
