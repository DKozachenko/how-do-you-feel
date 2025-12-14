import { Locator, Page } from 'playwright/test';

export class EmotionPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get openAddEmotionModalButton(): Locator {
    return this.page.getByTestId('open-add-emotion-modal-button');
  }

  get addEmotionModalForm(): Locator {
    return this.page.getByTestId('emotion-modal-form');
  }

  get addEmotionModalFormControls(): Locator {
    return this.page.getByTestId('emotion-modal-form-control');
  }
}
