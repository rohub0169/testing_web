const { test, expect } = require("@playwright/test");
const { LoginPage } = require("./pages/LoginPage");
const { InventoryPage } = require("./pages/InventoryPage");
const { CartPage } = require("./pages/CartPage");
const { CheckoutPage } = require("./pages/CheckoutPage");

const USERS = {
  standard: { username: "standard_user", password: "secret_sauce" },
  locked:   { username: "locked_out_user", password: "secret_sauce" },
};

// ─── TC-01: Successful login ────────────────────────────────────────────────
// Essential because login is the entry point to the entire application.
// Without it, no other functionality is reachable. Any regression here
// blocks every user from accessing the product.
test("TC-01: standard_user can log in and sees the product inventory", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.visit();
  await loginPage.login(USERS.standard.username, USERS.standard.password);

  await expect(inventoryPage.pageTitle).toHaveText("Products");
  await expect(inventoryPage.productList).toBeVisible();
  await expect(inventoryPage.inventoryItems).toHaveCount(6);
});

// ─── TC-02: Locked-out user is rejected ────────────────────────────────────
// Essential because locked accounts must be denied access. Validates that
// access control is enforced and the error message is visible to the user.
// Without this, a locked user could silently gain access.
test("TC-02: locked_out_user sees an error and stays on the login page", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.login(USERS.locked.username, USERS.locked.password);

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText("Sorry, this user has been locked out");
  await expect(page).toHaveURL("https://www.saucedemo.com/");
});

// ─── TC-03: Add item to cart ────────────────────────────────────────────────
// Essential because the cart is the core of the purchase journey.
// If items don't appear in the cart after being added, the entire
// purchase flow is broken regardless of login or checkout behaviour.
test("TC-03: added item appears in the cart with correct name and badge count", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await loginPage.visit();
  await loginPage.login(USERS.standard.username, USERS.standard.password);

  const itemName = await inventoryPage.getFirstItemName().textContent();
  await inventoryPage.addFirstItemToCart();

  await expect(inventoryPage.cartBadge).toHaveText("1");
  await inventoryPage.cartIcon.click();

  await expect(cartPage.cartItems).toHaveCount(1);
  await expect(cartPage.cartItemNames.first()).toHaveText(itemName);
});

// ─── TC-04: Complete checkout flow ─────────────────────────────────────────
// Essential because checkout is the final and most critical step of the
// purchase journey. A failure here means no orders can be completed,
// directly impacting revenue. Covers the full happy path:
// add item → cart → fill details → confirm order.
test("TC-04: user can complete a full purchase from inventory to order confirmation", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.visit();
  await loginPage.login(USERS.standard.username, USERS.standard.password);

  await inventoryPage.addFirstItemToCart();
  await expect(inventoryPage.cartBadge).toHaveText("1");

  await inventoryPage.cartIcon.click();
  await expect(cartPage.cartItems).toHaveCount(1);
  await cartPage.checkoutButton.click();

  await checkoutPage.fillDetails("Roman", "Tester", "91201");
  await checkoutPage.finishButton.click();

  await expect(checkoutPage.confirmationHeader).toBeVisible();
  await expect(checkoutPage.confirmationHeader).toHaveText("Thank you for your order!");
});
