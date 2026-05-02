/**
 * Part I — Flat tests (no POM)
 * Test suite: Search for Books by Keywords
 *
 * Rules:
 *   - Use only: getByRole, getByText, getByPlaceholder, getByLabel
 *   - No CSS class selectors, no XPath
 *
 * Tip: run `npx playwright codegen https://www.kriso.ee` to discover selectors.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.describe('Search for Books by Keywords', () => {

    test.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      page = await context.newPage();
  
      await page.goto('https://www.kriso.ee/');
      try {
        const consent = page.getByRole('button', { name: 'Nõustun' });
        if ((await consent.count()) > 0 && await consent.isVisible()) await consent.click();
      } catch (e) {
        // ignore
      }
    });
  
    test.afterAll(async () => {
      await page.context().close();
    });

    test('Test logo is visible', async () => {
      const logo = page.locator('.logo-icon');
      await expect(logo).toBeVisible();
    }); 

  test('Test no products found', async () => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('jaslkfjalskjdkls');
    await page.locator('#top-search-btn-wrap').click();

    await expect(page.locator('.msg.msg-info')).toContainText('Teie poolt sisestatud märksõnale vastavat raamatut ei leitud. Palun proovige uuesti!');
  });

    test('Test search results contain keyword', async () => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('Unicorn Activity Book For Kids');
    await page.locator('#top-search-btn-wrap').click();

    //TODO check results contain keyword
  });

    test('Test search by ISBN', async () => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('9781785356506');
    await page.locator('#top-search-btn-wrap').click();

    //TODO check correct book is shown
  });

});
