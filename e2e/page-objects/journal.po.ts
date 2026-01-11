import { Locator, Page, test, expect } from 'playwright/test';
// eslint-disable-next-line boundaries/element-types
import { Emotion } from '../../src/app/core/model/emotion.interface';

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

  get nameInputControl(): Locator {
    return this.page.locator('ion-input[formControlName="name"]');
  }

  get colorInputControl(): Locator {
    return this.page.locator('ion-input[formControlName="color"]');
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

  get emotionModalSaveButton(): Locator {
    return this.page.getByTestId('emotion-modal-save-button');
  }

  async checkPrivacy(
    emotion: Omit<Emotion, 'id' | 'dateTime'>,
    emotionCard: Locator,
    expectedLengthAfterRemove: number,
  ): Promise<void> {
    const ionCard = emotionCard.locator('ion-card');
    const ionCardStyle = await ionCard.getAttribute('style');
    expect(ionCardStyle).toContain('filter: blur');

    const emotionName = emotionCard.getByTestId('emotion-name');
    await expect(emotionName).toHaveText(emotion.name.replace(/[\wА-Яа-я]/g, '#'));

    const emotionTime = emotionCard.getByTestId('emotion-time');
    const emotionTimeText = await emotionTime.textContent();
    expect(emotionTimeText).toMatch(/##:##/);

    const emotionComment = emotionCard.getByTestId('emotion-comment');
    await expect(emotionComment).toHaveText((emotion.comment ?? '').replace(/[\wА-Яа-я]/g, '#'));

    const editCardButton = emotionCard.getByTestId('open-edit-emotion-modal-button');
    await test.step('Click on edit button', async () => await editCardButton.click({ force: true }));
    await expect(editCardButton).toHaveAttribute('disabled');
    await expect(this.editEmotionModalForm).not.toBeVisible();

    const removeCardButton = emotionCard.getByTestId('remove-emotion-button');
    await expect(removeCardButton).toHaveAttribute('disabled');
    await test.step('Click on remove button', async () => await removeCardButton.click({ force: true }));

    await expect(this.emotionCards).toHaveCount(expectedLengthAfterRemove);
  }

  async editEmotion(emotionCard: Locator, emotionData: Omit<Emotion, 'id' | 'dateTime' | 'private'>): Promise<void> {
    const cardEditButton = emotionCard.getByTestId('open-edit-emotion-modal-button');
    await test.step('Click on edit emotion modal button', async () => await cardEditButton.click());

    await expect(this.editEmotionModalForm).toBeVisible();

    await test.step(`Edit name control with value ${emotionData.name}`, async () =>
      await this.nameInputControl.locator('input').fill(emotionData.name));

    await test.step(`Edit color control with value ${emotionData.color}`, async () =>
      await this.colorInputControl.locator('input').fill(emotionData.color));

    await test.step(`Edit comment control with value ${emotionData.comment}`, async () =>
      await this.commentTextareaControl.locator('textarea').fill(emotionData.comment ?? ''));

    await test.step('Save test emotion', async () => await this.emotionModalSaveButton.click());

    await expect(this.emotionModalSaveButton).toBeHidden({ timeout: 3000 });
    await expect(this.emotionCards.first()).toBeVisible({ timeout: 3000 });
  }
}
