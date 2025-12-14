import { Locator, Page } from 'playwright/test';

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

  get commentTextareaControl(): Locator {
    return this.page.locator('.textarea[formControlName="comment"]');
  }
}
