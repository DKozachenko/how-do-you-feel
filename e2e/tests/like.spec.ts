import { test, expect, Page } from '@playwright/test';
import { Action } from '../../src/app/core/model/action.interface';
import { LIKE_PATHS } from '../../src/app/feature/like/like.routes';
import { TABS_LAYOUT_PATHS } from '../../src/app/layout/tabs-layout/tabs-layout.routes';
// eslint-disable-next-line boundaries/no-unknown
import { ADD_ACTION_FIELD_ORDER } from '../model/add-action-field-order.constant';
import { LikePageObject } from '../page-objects/like.po';

let sharedPage: Page;

const TEST_ACTIONS: Omit<Action, 'id' | 'history'>[] = [
  {
    name: 'Test Action',
    rate: 1,
    comment: 'Test Description',
    private: true,
  },
  {
    name: 'Test Action 2',
    rate: 8,
    comment: 'Test Description 2',
    private: false,
  },
];

// TODO:
// Edit Test
// Remove Test
// Private action "#" text
// Date test
test.describe('Like Page', () => {
  test.beforeAll(async ({ browser }) => {
    sharedPage = await browser.newPage();

    await test.step('Go to "like" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

    const likePageObject = new LikePageObject(sharedPage);

    for (let i = 0; i < TEST_ACTIONS.length; ++i) {
      const testEmotion = TEST_ACTIONS[i];
      await test.step(`Create test action with index ${i}`, async () => await likePageObject.createAction(testEmotion));
    }
  });

  test.afterAll(async () => {
    await test.step('Go to "like" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

    const likePageObject = new LikePageObject(sharedPage);

    const actionCards = await likePageObject.actionCards.all();

    for (let i = 0; i < actionCards.length; ++i) {
      const card = actionCards[i];

      const removeCardButton = card.getByTestId('remove-action-button');
      await test.step(`Remove test action with index ${i}`, async () => await removeCardButton.click());
    }

    await sharedPage.close();
  });

  test('Should display NON-private action so that it is visible', async () => {
    await test.step('Go to "like" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

    const likePageObject = new LikePageObject(sharedPage);

    const nonPrivateEmotionCard = likePageObject.actionCards.first();
    // Because "filter: initial" is applied not immediately, but after 50ms according to BlurDirective
    await sharedPage.waitForTimeout(300);
    const ionCard = nonPrivateEmotionCard.locator('ion-card');
    const ionCardStyle = await ionCard.getAttribute('style');
    expect(ionCardStyle).toContain('filter: initial');
  });

  test('Should display private emotion so that it is NOT visible and its actions NOT clickable', async () => {
    await test.step('Go to "like" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

    const likePageObject = new LikePageObject(sharedPage);

    const privateEmotionCard = likePageObject.actionCards.last();
    const ionCard = privateEmotionCard.locator('ion-card');
    const ionCardStyle = await ionCard.getAttribute('style');
    expect(ionCardStyle).toContain('filter: blur');

    const editCardButton = privateEmotionCard.getByTestId('open-edit-action-modal-button');
    await test.step('Click on edit button', async () => await editCardButton.click({ force: true }));
    await expect(editCardButton).toHaveAttribute('disabled');
    await expect(likePageObject.addActionModalForm).not.toBeVisible();

    const removeCardButton = privateEmotionCard.getByTestId('remove-action-button');
    await expect(removeCardButton).toHaveAttribute('disabled');
    await test.step('Click on remove button', async () => await removeCardButton.click({ force: true }));

    await expect(likePageObject.actionCards).toHaveCount(TEST_ACTIONS.length);
  });

  test('Should filter actions according to to search input', async () => {
    await test.step('Go to "like" page', async () =>
      await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

    const likePageObject = new LikePageObject(sharedPage);

    // Filtering NON-private action on purpose to be able to compare title and comment
    const searchQuery = 'description 2';
    await test.step(`Search action with value ${searchQuery}`, async () =>
      await likePageObject.fillSearchInput(searchQuery));

    const [filteredAction] = TEST_ACTIONS.filter(
      (action) =>
        action.name.toLocaleLowerCase().includes(searchQuery) ||
        (action.comment ?? '').toLocaleLowerCase().includes(searchQuery),
    );
    await expect(likePageObject.actionCards).toHaveCount(1);

    const filteredActionCard = likePageObject.actionCards.first();
    const filteredActionCardTitle = filteredActionCard.getByTestId('action-title');
    await expect(filteredActionCardTitle).toContainText(filteredAction.name);
    await expect(filteredActionCardTitle).toContainText(`${filteredAction.rate} / 10`);

    const filteredActionCardComment = filteredActionCard.getByTestId('action-comment');
    await expect(filteredActionCardComment).toContainText(filteredAction.comment ?? '');
  });

  test.describe('Add Action Modal', () => {
    test('Should create new action so it is displayed in the list', async () => {
      await test.step('Go to "like" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

      const likePageObject = new LikePageObject(sharedPage);
      const testAction: Omit<Action, 'id' | 'history'> = {
        name: 'Test Test Name',
        rate: 5,
        comment: 'Test Description',
        private: false,
      };

      await test.step('Create test action', async () => await likePageObject.createAction(testAction));

      await expect(likePageObject.actionCards).toHaveCount(TEST_ACTIONS.length + 1);
    });

    test('Should have correct field order in form (name, rate, comment, private)', async () => {
      await test.step('Go to "like" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

      const likePageObject = new LikePageObject(sharedPage);

      await test.step('Click on add action modal button', async () =>
        await likePageObject.openAddActionModalButton.click());

      await expect(likePageObject.addActionModalForm).toBeVisible();

      await expect(likePageObject.addActionModalFormControls).toHaveCount(4);

      const formControls = await likePageObject.addActionModalFormControls.all();

      for (let i = 0; i < formControls.length; ++i) {
        const control = formControls[i];

        await expect(control).toHaveAttribute('formControlName', ADD_ACTION_FIELD_ORDER[i]);
      }
    });

    test('Should have big comment textarea field', async () => {
      await test.step('Go to "like" page', async () =>
        await sharedPage.goto(`/${TABS_LAYOUT_PATHS.Index}/${LIKE_PATHS.Index}`));

      const likePageObject = new LikePageObject(sharedPage);

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
