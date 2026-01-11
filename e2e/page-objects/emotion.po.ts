import { Locator, Page, test, expect } from 'playwright/test';
// eslint-disable-next-line boundaries/element-types
import { Emotion } from '../../src/app/core/model/emotion.interface';

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

  async createEmotion(testEmotion: Omit<Emotion, 'id' | 'dateTime'>): Promise<void> {
    await test.step('Click on add emotion modal button', async () => await this.openAddEmotionModalButton.click());

    await expect(this.addEmotionModalFormControls.first()).toBeVisible({ timeout: 3000 });
    const formControls = await this.addEmotionModalFormControls.all();

    for (let i = 0; i < formControls.length; ++i) {
      const control = formControls[i];

      const controlName = <keyof Omit<Emotion, 'id' | 'dateTime'>>await control.getAttribute('formControlName') ?? '';
      const controlValue = testEmotion[controlName] ?? '';

      await test.step(`Fill control ${controlName} with value ${controlValue}`, async () => {
        const nativeInput = control.locator('input, textarea').first();

        if (typeof controlValue === 'string') {
          await nativeInput.fill(controlValue);
          await expect(nativeInput).toHaveValue(controlValue);
        } else {
          if (controlValue) {
            await control.click();
          }
          await expect(control).toHaveAttribute('aria-checked', String(controlValue));
        }
      });
    }

    await test.step('Save test emotion', async () => await this.emotionModalSaveButton.click());
    await expect(this.emotionModalSaveButton).toBeHidden({ timeout: 3000 });
    await expect(this.openAddEmotionModalButton).toBeVisible({ timeout: 3000 });
  }
}
