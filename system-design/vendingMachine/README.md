# Vending Machine - Low Level Design (LLD)

## Overview

Vending machine with state-based flow: Idle → HasCoin → Dispense.

## Requirements

- Insert coin
- Select product (by code)
- Dispense product and change
- Inventory management

## Design Patterns

- **State Machine**: IdleState, HasCoinState, DispenseState
- **Factory**: Product creation

## States

1. **Idle** → insert coin → HasCoin
2. **HasCoin** → select product → Dispense
3. **Dispense** → complete → Idle

## Usage

```javascript
const vm = new VendingMachine();
vm.addProduct('A1', 'Coke', 2);
vm.insertCoin(2);
vm.selectProduct('A1');
vm.dispense();
```
