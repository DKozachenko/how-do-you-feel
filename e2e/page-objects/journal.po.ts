import { Locator, Page } from 'playwright/test';

export class JournalPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get openEditEmotionModalButton(): Locator {
    return this.page.getByTestId('open-edit-emotion-modal-button');
  }

  get editEmotionModalForm(): Locator {
    return this.page.getByTestId('edit-emotion-modal-form');
  }

  get editEmotionModalFormControls(): Locator {
    return this.page.getByTestId('edit-emotion-modal-form-control');
  }

  get emotionCards(): Locator {
    return this.page.getByTestId('emotion-card');
  }
}
