/**
 * Shopping Cart - Composite, Strategy (Discount)
 */

class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

class CartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }
  getSubtotal() {
    return this.product.price * this.quantity;
  }
}

class DiscountStrategy {
  apply(subtotal) {
    throw new Error('Implement');
  }
}

class PercentageDiscount extends DiscountStrategy {
  constructor(percent) {
    super();
    this.percent = percent;
  }
  apply(subtotal) {
    return subtotal * (this.percent / 100);
  }
}

class FixedDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }
  apply(subtotal) {
    return Math.min(this.amount, subtotal);
  }
}

class Cart {
  constructor() {
    this.items = [];
    this.discountStrategy = null;
  }

  addProduct(product, quantity = 1) {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) existing.quantity += quantity;
    else this.items.push(new CartItem(product, quantity));
  }

  removeProduct(productId) {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  setDiscount(strategy) {
    this.discountStrategy = strategy;
  }

  getSubtotal() {
    return this.items.reduce((sum, i) => sum + i.getSubtotal(), 0);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.discountStrategy ? this.discountStrategy.apply(subtotal) : 0;
    return subtotal - discount;
  }

  checkout() {
    const total = this.getTotal();
    console.log(`Checkout: $${total}`);
    this.items = [];
    return total;
  }
}

// Demo
if (require.main === module) {
  const cart = new Cart();
  cart.addProduct(new Product(1, 'Laptop', 1000), 1);
  cart.addProduct(new Product(2, 'Mouse', 20), 2);
  cart.setDiscount(new PercentageDiscount(10));
  console.log('Subtotal:', cart.getSubtotal());
  console.log('Total:', cart.getTotal());
  cart.checkout();
}

module.exports = { Cart, Product, CartItem, PercentageDiscount, FixedDiscount };
