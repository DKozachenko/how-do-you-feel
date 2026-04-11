import { Locator, Page } from 'playwright/test';

export class SettingsPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get versionTitle(): Locator {
    return this.page.getByTestId('version-title');
  }

  get exportDataButton(): Locator {
    return this.page.getByTestId('export-data-button');
  }
}
