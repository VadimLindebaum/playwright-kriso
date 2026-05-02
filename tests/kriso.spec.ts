/**
 * Combined flat UI test suites: search, filters, cart
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Search for Books by Keywords', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.kriso.ee/');
    try {
      const consent = page.getByRole('button', { name: 'Nõustun' });
      if ((await consent.count()) > 0 && await consent.isVisible()) await consent.click();
    } catch (e) {}
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

});

test.describe('Navigate Products via Filters', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.kriso.ee/');
    try {
      const consent = page.getByRole('button', { name: 'Nõustun' });
      if ((await consent.count()) > 0 && await consent.isVisible()) await consent.click();
    } catch (e) {}
  });

  test('Test logo & search present', async ({ page }) => {
    await expect(page.locator('.logo-icon')).toBeVisible();
    await expect(page.locator('#top-search-text')).toBeVisible();
  });

  test('Test navigation contains links', async ({ page }) => {
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

});

test.describe('Add Books to Shopping Cart', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.kriso.ee/');
    try {
      const consent = page.getByRole('button', { name: 'Nõustun' });
      if ((await consent.count()) > 0 && await consent.isVisible()) await consent.click();
    } catch (e) {}
  });

  test('Test add and remove items from cart', async ({ page }) => {
    const addFirst = page.getByRole('link', { name: 'Lisa ostukorvi' }).first();
    await addFirst.waitFor({ state: 'visible', timeout: 10000 });
    await addFirst.click();
    await expect(page.locator('.item-messagebox')).toContainText('Toode lisati ostukorvi');
    await expect(page.locator('.cart-products')).toContainText('1');
    await page.locator('.cartbtn-event.back').click();

    const addSecond = page.getByRole('link', { name: 'Lisa ostukorvi' }).nth(5);
    await addSecond.waitFor({ state: 'visible', timeout: 10000 });
    await addSecond.click();
    await expect(page.locator('.item-messagebox')).toContainText('Toode lisati ostukorvi');
    await expect(page.locator('.cart-products')).toContainText('2');

    await page.locator('.cartbtn-event.forward').click();
    await expect(page.locator('.order-qty > .o-value')).toContainText('2');

    // remove one and verify
    await page.locator('.icon-remove').nth(0).click();
    await expect(page.locator('.order-qty > .o-value')).toContainText('1');
  });

});
