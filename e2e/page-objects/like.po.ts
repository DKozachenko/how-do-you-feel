import { Locator, Page, test, expect } from 'playwright/test';
// eslint-disable-next-line boundaries/element-types
import { Action } from '../../src/app/core/model/action.interface';

export class LikePageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get pageTitle(): Locator {
    return this.page.getByTestId('page-title');
  }

  get openAddActionModalButton(): Locator {
    return this.page.getByTestId('open-add-action-modal-button');
  }

  get addActionModalForm(): Locator {
    return this.page.getByTestId('action-modal-form');
  }

  get addActionModalFormControls(): Locator {
    return this.page.getByTestId('action-modal-form-control');
  }

  get actionModalSaveButton(): Locator {
    return this.page.getByTestId('action-modal-save-button');
  }

  get nameInputControl(): Locator {
    return this.page.locator('ion-input[formControlName="name"]');
  }

  get rateInputControl(): Locator {
    return this.page.locator('ion-input[formControlName="rate"]');
  }

  get commentTextareaControl(): Locator {
    return this.page.locator('.textarea[formControlName="comment"]');
  }

  get actionCards(): Locator {
    return this.page.getByTestId('action-card');
  }

  get search(): Locator {
    return this.page.getByTestId('search');
  }

  async createAction(testAction: Omit<Action, 'id' | 'history'>): Promise<void> {
    await test.step('Click on add action modal button', async () => await this.openAddActionModalButton.click());

    await expect(this.addActionModalFormControls.first()).toBeVisible({ timeout: 3000 });
    const formControls = await this.addActionModalFormControls.all();

    for (let i = 0; i < formControls.length; ++i) {
      const control = formControls[i];

      const controlName = <keyof Omit<Action, 'id' | 'history'>>await control.getAttribute('formControlName') ?? '';
      const controlValue = testAction[controlName] ?? '';

      await test.step(`Fill control ${controlName} with value ${controlValue}`, async () => {
        const nativeInput = control.locator('input, textarea').first();

        if (typeof controlValue === 'string' || typeof controlValue === 'number') {
          await nativeInput.fill(String(controlValue));
          await expect(nativeInput).toHaveValue(String(controlValue));
        } else {
          if (controlValue) {
            await control.click();
          }
          await expect(control).toHaveAttribute('aria-checked', String(controlValue));
        }
      });
    }

    await test.step('Save test action', async () => await this.actionModalSaveButton.click());

    await expect(this.actionModalSaveButton).toBeHidden({ timeout: 3000 });
    await expect(this.openAddActionModalButton.first()).toBeVisible({ timeout: 3000 });
  }

  async editAction(actionCard: Locator, actionData: Omit<Action, 'id' | 'history' | 'private'>): Promise<void> {
    const cardEditButton = actionCard.getByTestId('open-edit-action-modal-button');
    await test.step('Click on edit action modal button', async () => await cardEditButton.click());

    await expect(this.addActionModalForm).toBeVisible();

    await test.step(`Edit name control with value ${actionData.name}`, async () =>
      await this.nameInputControl.locator('input').fill(actionData.name));

    await test.step(`Edit rate control with value ${actionData.rate}`, async () =>
      await this.rateInputControl.locator('input').fill(String(actionData.rate)));

    await test.step(`Edit comment control with value ${actionData.comment}`, async () =>
      await this.commentTextareaControl.locator('textarea').fill(actionData.comment ?? ''));

    await test.step('Save test action', async () => await this.actionModalSaveButton.click());

    await expect(this.actionModalSaveButton).toBeHidden({ timeout: 3000 });
    await expect(this.actionCards.first()).toBeVisible({ timeout: 3000 });
  }

  async fillSearchInput(query: string): Promise<void> {
    const nativeInput = this.search.locator('input');
    await test.step(`Fill native search input with value ${query}`, async () => await nativeInput.fill(query));
  }

  async checkPrivacy(
    action: Omit<Action, 'id' | 'history'>,
    actionCard: Locator,
    expectedLengthAfterRemove: number,
  ): Promise<void> {
    const ionCard = actionCard.locator('ion-card');
    const ionCardStyle = await ionCard.getAttribute('style');
    expect(ionCardStyle).toContain('filter: blur');

    const actionName = actionCard.getByTestId('action-title');
    await expect(actionName).toContainText(action.name.replace(/[\wА-Яа-я]/g, '#'));
    await expect(actionName).toContainText('(# / 10)');

    const actionComment = actionCard.getByTestId('action-comment');
    await expect(actionComment).toHaveText((action.comment ?? '').replace(/[\wА-Яа-я]/g, '#'));

    const editCardButton = actionCard.getByTestId('open-edit-action-modal-button');
    await test.step('Click on edit button', async () => await editCardButton.click({ force: true }));
    await expect(editCardButton).toHaveAttribute('disabled');
    await expect(this.addActionModalForm).not.toBeVisible();

    const removeCardButton = actionCard.getByTestId('remove-action-button');
    await expect(removeCardButton).toHaveAttribute('disabled');
    await test.step('Click on remove button', async () => await removeCardButton.click({ force: true }));

    await expect(this.actionCards).toHaveCount(expectedLengthAfterRemove);
  }
}
