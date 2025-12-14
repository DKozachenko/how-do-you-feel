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

  get emotionModalSaveButton(): Locator {
    return this.page.getByTestId('emotion-modal-save-button');
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
