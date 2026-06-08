class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItems = page.locator(".cart_item");
    this.cartItemNames = page.locator(".inventory_item_name");
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }
}

module.exports = { CartPage };
