import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly logo: Locator;
  protected readonly consentButton: Locator;
  protected readonly searchInput: Locator;
  protected readonly searchButton: Locator;

  constructor(protected page: Page) {
    this.logo = this.page.locator('.logo-icon');
    this.consentButton = this.page.getByRole('button', { name: 'Nõustun' });
    this.searchInput = this.page.locator('#top-search-text');
    this.searchButton = this.page.locator('#top-search-btn-wrap');
  }

  async acceptCookies() {
    try {
      // try primary consent button (Estonian text), then fallbacks
      if ((await this.consentButton.count()) > 0) {
        await this.consentButton.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
        if (await this.consentButton.isVisible()) {
          await this.consentButton.click();
          return;
        }
      }

      // fallback: click cookie preferences link if present
      const pref = this.page.getByText('Muutke küpsiste eelistusi').first();
      if ((await pref.count()) > 0) {
        await pref.click().catch(() => {});
        // try to find an accept/confirm inside the opened preferences
        const acceptOpt = this.page.getByRole('button', { name: /Nõustun|Accept|Kinnita/i }).first();
        if ((await acceptOpt.count()) > 0) {
          await acceptOpt.waitFor({ state: 'visible', timeout: 5_000 }).catch(() => {});
          await acceptOpt.click().catch(() => {});
          return;
        }
      }

      // last resort: remove common cookie banner elements from DOM
      await this.page.evaluate(() => {
        const selectors = ['.cookie-consent', '.cookie-banner', '#cookie', '.cc-window', '.cc_banner'];
        selectors.forEach(s => {
          const el = document.querySelector(s);
          if (el) el.remove();
        });
      }).catch(() => {});
    } catch (e) {
      // ignore errors if page/context is already closed or button not available
    }
  }

  async verifyLogo() {
    await expect(this.logo).toBeVisible();
  }

  async searchByKeyword(keyword: string) {
    await this.searchInput.click();
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }
}
