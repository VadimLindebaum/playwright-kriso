/**
 * Refactored tests using Page Object Model
 */
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

test.describe.configure({ mode: 'serial' });

test.describe('POM — Search and Cart flows', () => {
  let home: HomePage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.openUrl();
    await home.acceptCookies();
  });

  test('POM: verify search returns results', async () => {
    await home.searchByKeyword('Books, Editors of Chartwell');
    await home.verifyResultsCountMoreThan(1);
  });

  test('POM: add two items and validate cart totals', async () => {
    await home.addToCartByIndex(0);
    await home.verifyAddToCartMessage();
    await home.verifyCartCount(1);
    await home.goBackFromCart();

    await home.addToCartByIndex(5);
    await home.verifyAddToCartMessage();
    await home.verifyCartCount(2);

    cart = await home.openShoppingCart();
    await cart.verifyCartCount(2);
    await cart.verifyCartSumIsCorrect();

    await cart.removeItemByIndex(0);
    await cart.verifyCartCount(1);
  });

});
