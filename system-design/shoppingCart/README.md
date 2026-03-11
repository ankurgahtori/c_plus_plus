# E-Commerce Shopping Cart - Low Level Design (LLD)

## Overview

Shopping cart: add/remove items, apply discounts, checkout.

## Requirements

- Add/remove items
- Update quantity
- Apply discount (percentage or fixed)
- Calculate total, checkout

## Design Patterns

- **Composite**: Cart contains CartItems (can extend to product bundles)
- **Strategy**: Discount strategies (PercentageDiscount, FixedDiscount)

## Core Components

- **Product**: id, name, price
- **CartItem**: product + quantity
- **Cart**: list of CartItems, discount strategy
- **DiscountStrategy**: calculate discount
