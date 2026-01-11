import { Locator, Page } from 'playwright/test';

export class InfoPageObject {
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
