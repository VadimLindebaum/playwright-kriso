/**
 * Combined flat UI test suites: search, filters, cart
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
    await page.getByRole('button', { name: 'Nõustun' }).click();
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

    // basic assertion: there should be at least one result
    const resultsText = await page.locator('.sb-results-total').first().textContent();
    const total = Number((resultsText || '').replace(/\D/g, '')) || 0;
    expect(total).toBeGreaterThan(0);
  });

});

test.describe('Navigate Products via Filters', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Nõustun' }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Test logo & search present', async () => {
    await expect(page.locator('.logo-icon')).toBeVisible();
    await expect(page.locator('#top-search-text')).toBeVisible();
  });

  test('Test navigation contains links', async () => {
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

});

test.describe('Add Books to Shopping Cart', () => {

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://www.kriso.ee/');
    await page.getByRole('button', { name: 'Nõustun' }).click();
  });

  test.afterAll(async () => {
    await page.context().close();
  });

  test('Test add and remove items from cart', async () => {
    await page.getByRole('link', { name: 'Lisa ostukorvi' }).first().click();
    await expect(page.locator('.item-messagebox')).toContainText('Toode lisati ostukorvi');
    await expect(page.locator('.cart-products')).toContainText('1');
    await page.locator('.cartbtn-event.back').click();

    await page.getByRole('link', { name: 'Lisa ostukorvi' }).nth(5).click();
    await expect(page.locator('.item-messagebox')).toContainText('Toode lisati ostukorvi');
    await expect(page.locator('.cart-products')).toContainText('2');

    await page.locator('.cartbtn-event.forward').click();
    await expect(page.locator('.order-qty > .o-value')).toContainText('2');

    // remove one and verify
    await page.locator('.icon-remove').nth(0).click();
    await expect(page.locator('.order-qty > .o-value')).toContainText('1');
  });

});
