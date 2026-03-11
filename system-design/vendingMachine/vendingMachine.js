/**
 * Vending Machine - State Machine pattern
 */

class VendingMachineState {
  insertCoin(vm, amount) { throw new Error('Implement'); }
  selectProduct(vm, code) { throw new Error('Implement'); }
  dispense(vm) { throw new Error('Implement'); }
}

class IdleState extends VendingMachineState {
  insertCoin(vm, amount) {
    vm.coinInserted = amount;
    vm.setState(new HasCoinState());
  }
  selectProduct() { console.log('Insert coin first'); }
  dispense() { console.log('Insert coin first'); }
}

class HasCoinState extends VendingMachineState {
  insertCoin(vm, amount) { vm.coinInserted += amount; }
  selectProduct(vm, code) {
    const product = vm.inventory.get(code);
    if (!product) { console.log('Invalid product'); return; }
    if (product.price > vm.coinInserted) { console.log('Insufficient amount'); return; }
    vm.selectedProduct = product;
    vm.setState(new DispenseState());
  }
  dispense() { console.log('Select product first'); }
}

class DispenseState extends VendingMachineState {
  insertCoin() { console.log('Already has coin'); }
  selectProduct() { console.log('Dispensing...'); }
  dispense(vm) {
    const product = vm.selectedProduct;
    const change = vm.coinInserted - product.price;
    console.log(`Dispensed ${product.name}. Change: $${change}`);
    vm.inventory.delete(product.code);
    vm.coinInserted = 0;
    vm.selectedProduct = null;
    vm.setState(new IdleState());
  }
}

class Product {
  constructor(code, name, price) {
    this.code = code;
    this.name = name;
    this.price = price;
  }
}

class VendingMachine {
  constructor() {
    this.state = new IdleState();
    this.inventory = new Map();
    this.coinInserted = 0;
    this.selectedProduct = null;
  }

  setState(state) { this.state = state; }
  addProduct(code, name, price) { this.inventory.set(code, new Product(code, name, price)); }
  insertCoin(amount) { this.state.insertCoin(this, amount); }
  selectProduct(code) { this.state.selectProduct(this, code); }
  dispense() { this.state.dispense(this); }
}

// Demo
if (require.main === module) {
  const vm = new VendingMachine();
  vm.addProduct('A1', 'Coke', 2);
  vm.insertCoin(2);
  vm.selectProduct('A1');
  vm.dispense();
}

module.exports = { VendingMachine, Product };
