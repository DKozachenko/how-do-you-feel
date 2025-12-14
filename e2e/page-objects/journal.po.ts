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

  get commentTextareaControl(): Locator {
    return this.page.locator('.textarea[formControlName="comment"]');
  }

  get emotionHintButton(): Locator {
    return this.page.getByTestId('emotion-hint-button');
  }

  get emotionsHintModal(): Locator {
    return this.page.getByTestId('emotions-hint-modal');
  }

  get cssColorsHintButton(): Locator {
    return this.page.getByTestId('css-colors-hint-button');
  }

  get cssColorsHintModal(): Locator {
    return this.page.getByTestId('css-colors-hint-modal');
  }
}
