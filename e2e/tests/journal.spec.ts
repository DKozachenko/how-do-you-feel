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

const TEST_EMOTIONS: Omit<Emotion, 'id' | 'dateTime'>[] = [
  {
    name: 'Test Name',
    color: 'green',
    comment: 'Test Description',
    private: true,
  },
  {
    name: 'Test Name 2',
    color: 'blue',
    comment: 'Test Description 2',
    private: false,
  },
];

// TODO:
// Color cirle Test
// Edit Test
// Remove Test
// Datepicket test
// Private action "#" text
// Datetime test
test.describe('Journal Page', () => {
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();

    await test.step('Go to "emotion" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${EMOTION_PATHS.Index}`));

    const emotionPageObject = new EmotionPageObject(sharedPage);

    for (let i = 0; i < TEST_EMOTIONS.length; ++i) {
      const testEmotion = TEST_EMOTIONS[i];
      await test.step(`Create test emotion with index ${i}`, async () =>
        await emotionPageObject.createEmotion(testEmotion));
    }
  });

  test.afterAll(async () => {
    await test.step('Go to "journal" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

    const journalPageObject = new JournalPageObject(sharedPage);

    const emotionCards = await journalPageObject.emotionCards.all();

    for (let i = 0; i < emotionCards.length; ++i) {
      const card = emotionCards[i];

      const removeCardButton = card.getByTestId('remove-emotion-button');
      await test.step(`Remove test emotion with index ${i}`, async () => await removeCardButton.click());
    }

    await sharedPage.close();
  });

  test('Should display emotion card', async () => {
    await test.step('Go to "journal" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

    const journalPageObject = new JournalPageObject(sharedPage);

    await expect(journalPageObject.emotionCards).toHaveCount(TEST_EMOTIONS.length);
  });

  test.describe('Edit Emotion Modal', () => {
    test('Should have correct field order in form (name, color, comment, dateTime)', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on edit emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.first().click());

      await expect(journalPageObject.editEmotionModalForm).toBeVisible();

      await expect(journalPageObject.editEmotionModalFormControls).toHaveCount(5);

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
        await journalPageObject.openEditEmotionModalButton.first().click());

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

      await test.step('Click on edit emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.first().click());

      await test.step('Click on emotion hint button', async () => await journalPageObject.emotionHintButton.click());

      await expect(journalPageObject.emotionsHintModal).toBeVisible();
    });

    test('Should open modal with css colors description', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      await test.step('Click on edit emotion modal button', async () =>
        await journalPageObject.openEditEmotionModalButton.first().click());

      await test.step('Click on css colors hint button', async () =>
        await journalPageObject.cssColorsHintButton.click());

      await expect(journalPageObject.cssColorsHintModal).toBeVisible();
    });

    test('Should display NON-private emotion so that it is visible', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      const nonPrivateEmotionCard = journalPageObject.emotionCards.first();
      // Because "filter: initial" is applied not immediately, but after 50ms according to BlurDirective
      await sharedPage.waitForTimeout(300);
      const ionCard = nonPrivateEmotionCard.locator('ion-card');
      const ionCardStyle = await ionCard.getAttribute('style');
      expect(ionCardStyle).toContain('filter: initial');
    });

    test('Should display private emotion so that it is NOT visible and its actions NOT clickable', async () => {
      await test.step('Go to "journal" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${JOURNAL_PATHS.Index}`));

      const journalPageObject = new JournalPageObject(sharedPage);

      const privateEmotionCard = journalPageObject.emotionCards.last();
      const ionCard = privateEmotionCard.locator('ion-card');
      const ionCardStyle = await ionCard.getAttribute('style');
      expect(ionCardStyle).toContain('filter: blur');

      const editCardButton = privateEmotionCard.getByTestId('open-edit-emotion-modal-button');
      await test.step('Click on edit button', async () => await editCardButton.click({ force: true }));
      await expect(editCardButton).toHaveAttribute('disabled');
      await expect(journalPageObject.editEmotionModalForm).not.toBeVisible();

      const removeCardButton = privateEmotionCard.getByTestId('remove-emotion-button');
      await expect(removeCardButton).toHaveAttribute('disabled');
      await test.step('Click on remove button', async () => await removeCardButton.click({ force: true }));

      await expect(journalPageObject.emotionCards).toHaveCount(TEST_EMOTIONS.length);
    });
  });
});
