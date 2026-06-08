class InventoryPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator(".title");
    this.productList = page.locator(".inventory_list");
    this.inventoryItems = page.locator(".inventory_item");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.cartBadge = page.locator(".shopping_cart_badge");
  }

  async addFirstItemToCart() {
    await this.inventoryItems.first().locator("button").click();
  }

  getFirstItemName() {
    return this.inventoryItems.first().locator(".inventory_item_name");
  }
}

module.exports = { InventoryPage };
