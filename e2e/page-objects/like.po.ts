import { Locator, Page, test, expect } from 'playwright/test';
// eslint-disable-next-line boundaries/element-types
import { Action } from '../../src/app/core/model/action.interface';

export class LikePageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
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
  }

  async fillSearchInput(query: string): Promise<void> {
    const nativeInput = this.search.locator('input');
    await test.step(`Fill native search input with value ${query}`, async () => await nativeInput.fill(query));
  }
}
