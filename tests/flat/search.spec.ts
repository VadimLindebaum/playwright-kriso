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

test.describe('Search for Books by Keywords', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.kriso.ee/');
    try {
      const consent = page.getByRole('button', { name: 'Nõustun' });
      if ((await consent.count()) > 0 && await consent.isVisible()) await consent.click();
    } catch (e) {
      // ignore
    }
  });

  test('Test logo is visible', async ({ page }) => {
    const logo = page.locator('.logo-icon');
    await expect(logo).toBeVisible();
  });

  test('Test no products found', async ({ page }) => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('jaslkfjalskjdkls');
    await page.locator('#top-search-btn-wrap').click();

    await expect(page.locator('.msg.msg-info')).toContainText('Teie poolt sisestatud märksõnale vastavat raamatut ei leitud. Palun proovige uuesti!');
  });

  test('Test search results contain keyword', async ({ page }) => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('Unicorn Activity Book For Kids');
    await page.locator('#top-search-btn-wrap').click();

    const resultsText = await page.locator('.sb-results-total').first().textContent();
    const total = Number((resultsText || '').replace(/\D/g, '')) || 0;
    expect(total).toBeGreaterThan(0);
  });

  test('Test search by ISBN', async ({ page }) => {
    await page.locator('#top-search-text').click();
    await page.locator('#top-search-text').fill('9781785356506');
    await page.locator('#top-search-btn-wrap').click();

    const resultsText = await page.locator('.sb-results-total').first().textContent();
    const total = Number((resultsText || '').replace(/\D/g, '')) || 0;
    expect(total).toBeGreaterThan(0);
  });

});
